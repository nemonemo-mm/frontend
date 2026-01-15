const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@react-native",
  "gradle-plugin",
  "react-native-gradle-plugin",
  "src",
  "main",
  "kotlin",
  "com",
  "facebook",
  "react",
  "utils",
  "AgpConfiguratorUtils.kt"
);

if (!fs.existsSync(filePath)) {
  // Nothing to patch before dependencies are installed.
  process.exit(0);
}

let content = fs.readFileSync(filePath, "utf8");
const pattern =
  '    project.pluginManager.withPlugin("com.android.library", action)\n';
if (!content.includes(pattern)) {
  process.exit(0);
}

content = content.replace(pattern, "");
fs.writeFileSync(filePath, content, "utf8");

console.log("Patched React Native Gradle plugin to skip dev server res values for libs.");
