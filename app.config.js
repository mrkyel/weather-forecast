const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

export default {
  expo: {
    name: "우리동네 미세먼지",
    slug: "fine-dust-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourdomain.finedustapp",
      buildNumber: "1.0.0",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "현재 위치의 미세먼지 정보를 확인하기 위해 위치 권한이 필요합니다.",
        UIBackgroundModes: ["location", "fetch"],
      },
    },
    android: {
      package: "com.yourdomain.finedustapp",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    },
    extra: {
      eas: {
        projectId: "your-project-id",
      },
      expoPublicApiUrl: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};
