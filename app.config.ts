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
  name: "네모네모",
  slug: "frontend",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "frontend",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "cover",
    backgroundColor: "#FFF",
  },
  ios: {
    infoPlist: {
      NSCameraUsageDescription:
        "프로필 사진 또는 팀 활동 이미지를 직접 촬영해 등록하려면 카메라 접근 권한이 필요합니다. 촬영한 이미지에만 접근하며, 권한을 허용하지 않아도 다른 기능은 사용할 수 있습니다.",
      NSPhotoLibraryUsageDescription:
        "프로필 사진 또는 팀 활동 이미지로 사용할 사진을 선택하려면 사진 보관함 접근 권한이 필요합니다. 사용자가 선택한 사진만 업로드되며, 전체 보관함을 임의로 수집하지 않습니다.",
      NSPhotoLibraryAddUsageDescription:
        "촬영하거나 편집한 이미지를 기기 사진 보관함에 저장하려면 저장 권한이 필요합니다. 저장 기능 외 다른 목적에는 사용되지 않습니다.",
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
      ITSAppUsesNonExemptEncryption: false,
    },
    supportsTablet: true,
    usesAppleSignIn: true,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist",
    bundleIdentifier: "com.nemonemomm.frontend",
  },
  android: {
    softwareKeyboardLayoutMode: "resize",
    adaptiveIcon: {
      backgroundColor: "#FFF",
      foregroundImage: "./assets/images/icon.png",
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
    "expo-notifications",
    "expo-apple-authentication",
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
    "./plugins/with-rnfirebase-ios.cjs",
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
    [
      "expo-image-picker",
      {
        photosPermission:
          "프로필 사진 및 팀 활동 이미지를 등록하거나 변경하려면 사진 보관함 접근 권한이 필요합니다. 선택한 사진만 앱에 업로드되며, 동의하지 않아도 다른 기능은 계속 사용할 수 있습니다.",
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
