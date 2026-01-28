import type { ExpoConfig } from "expo/config";
import fs from "fs";
import path from "path";

const googleServicesPath = "./google-services.json";

if (process.env.GOOGLE_SERVICES_JSON) {
  fs.mkdirSync(path.dirname(googleServicesPath), { recursive: true });
  fs.writeFileSync(
    googleServicesPath,
    Buffer.from(process.env.GOOGLE_SERVICES_JSON, "base64")
  );
}

export default {
  name: "frontend",
  slug: "frontend",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "frontend",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    infoPlist: {
      NSCameraUsageDescription:
        "프로필 사진 촬영/업로드를 위해 카메라 접근 권한이 필요합니다.",
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
    supportsTablet: true,
    googleServicesFile: "./GoogleService-Info.plist",
    bundleIdentifier: "com.nemonemomm.frontend",
  },
  android: {
    softwareKeyboardLayoutMode: "resize",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.nemonemomm.frontend",
    googleServicesFile: googleServicesPath,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "72d511b4-3dcd-49eb-877d-a1225aa316d9",
    },
  },
  owner: "nemonemo-mm",
} satisfies ExpoConfig;
