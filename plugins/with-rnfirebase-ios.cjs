const { withAppDelegate, withPodfile } = require("@expo/config-plugins");

function addRNFirebaseStaticFrameworkFlag(contents) {
  if (contents.includes("$RNFirebaseAsStaticFramework")) return contents;

  // Keep it near the top and before `target` so CocoaPods picks it up.
  if (contents.includes("prepare_react_native_project!\n")) {
    return contents.replace(
      "prepare_react_native_project!\n",
      "prepare_react_native_project!\n\n$RNFirebaseAsStaticFramework = true\n"
    );
  }

  return `$RNFirebaseAsStaticFramework = true\n\n${contents}`;
}

function addNonModularIncludeWorkaround(contents) {
  if (contents.includes("CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES")) {
    return contents;
  }

  const postInstallStart = contents.indexOf("post_install do |installer|");
  if (postInstallStart === -1) return contents;

  const afterStart = contents.slice(postInstallStart);
  const postInstallEndRelativeIdx = afterStart.indexOf("\n  end");
  if (postInstallEndRelativeIdx === -1) return contents;

  const insertPos = postInstallStart + postInstallEndRelativeIdx;
  const snippet =
    "\n" +
    "    # React Native Firebase + use_frameworks(static) can trigger non-modular header errors\n" +
    "    # when RNFB* pods import React headers inside a framework module.\n" +
    "    installer.pods_project.targets.each do |target|\n" +
    "      next unless target.name.start_with?('RNFB')\n" +
    "      target.build_configurations.each do |config|\n" +
    "        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'\n" +
    "        config.build_settings['CLANG_WARN_NON_MODULAR_INCLUDE_IN_FRAMEWORK_MODULE'] = 'NO'\n" +
    "      end\n" +
    "    end\n";

  return contents.slice(0, insertPos) + snippet + contents.slice(insertPos);
}

module.exports = function withRNFirebaseIOS(config) {
  config = withPodfile(config, (config) => {
    let contents = config.modResults.contents;
    contents = addRNFirebaseStaticFrameworkFlag(contents);
    contents = addNonModularIncludeWorkaround(contents);
    config.modResults.contents = contents;
    return config;
  });

  // Ensure Firebase is configured on app start (Swift AppDelegate in Expo prebuild projects)
  config = withAppDelegate(config, (config) => {
    const { modResults } = config;

    // Only handle Swift AppDelegate (Expo SDK 50+ commonly generates Swift AppDelegate)
    if (!modResults || modResults.language !== "swift") return config;

    let contents = modResults.contents;

    // 1) Add import
    if (!contents.includes("import FirebaseCore")) {
      // Insert after the last import line at the top of file.
      contents = contents.replace(
        /^(import[^\n]*\n)+/m,
        (match) => `${match}import FirebaseCore\n`
      );
    }

    // 2) Add FirebaseApp.configure() early in didFinishLaunchingWithOptions
    const configureSnippet =
      "\n" +
      "    if FirebaseApp.app() == nil {\n" +
      "      FirebaseApp.configure()\n" +
      "    }\n";

    if (!contents.includes("FirebaseApp.configure()")) {
      contents = contents.replace(
        /(\s*public\s+override\s+func\s+application\([\s\S]*?\)\s*->\s*Bool\s*\{\n)/m,
        `$1${configureSnippet}`
      );
    }

    modResults.contents = contents;
    return config;
  });

  return config;
};

