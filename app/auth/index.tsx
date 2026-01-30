import { socialLogin } from "@/features/auth/api/auth";
import AppleAuth from "@/features/auth/components/AppleAuth";
import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";
import { setPendingSocialLogin } from "@/features/auth/utils/pendingSocialLogin";
import {
  saveAccessToken,
  saveRefreshToken,
} from "@/features/auth/utils/tokenStorage";
import { globalGreen300, globalSpacingSm } from "@/shared/ui";
import GoogleAuthButton from "@/shared/ui/molecules/GoogleAuthButton";
import { useRouter } from "expo-router";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthScreen = () => {
  const router = useRouter();
  const { login: googleLogin, isLoading } = useGoogleLogin();

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    try {
      const googleResult = await googleLogin();

      if (!googleResult) {
        // 사용자가 로그인을 취소한 경우
        return;
      }

      // 플랫폼 정보 설정
      const clientType =
        Platform.OS === "ios"
          ? "IOS"
          : Platform.OS === "android"
            ? "ANDROID"
            : "WEB";
      const deviceType = Platform.OS === "ios" ? "iOS" : "Android";

      // 소셜 로그인 API 호출 (userName 제외)
      const response = await socialLogin({
        provider: "GOOGLE",
        firebaseIdToken: googleResult.firebaseIdToken,
        clientType,
        deviceType,
      });

      console.log("응답:", response);

      // 신규 유저면: 토큰 저장 시도하지 말고, 가입 플로우로 넘기기
      if (response.newUser === true) {
        await setPendingSocialLogin({
          provider: "GOOGLE",
          firebaseIdToken: googleResult.firebaseIdToken,
          clientType,
          deviceType,
        });
        router.push("/auth/signup");
        return;
      }

      // 기존 유저면: 토큰이 "문자열"일 때만 저장
      if (
        typeof response.accessToken !== "string" ||
        typeof response.refreshToken !== "string"
      ) {
        console.error(
          "소셜 로그인 응답에 토큰이 없거나 형식이 올바르지 않습니다:",
          response,
        );
        throw new Error(
          "로그인 토큰을 받지 못했습니다. 서버 응답 스펙을 확인해 주세요.",
        );
      }

      await saveAccessToken(response.accessToken);
      await saveRefreshToken(response.refreshToken);
      router.push("/(tabs)/home");
    } catch (error: any) {
      console.error("구글 로그인 실패 - 상세 에러:", {
        message: error?.message,
        code: error?.code,
        response: error?.response?.data,
        status: error?.response?.status,
        request: {
          url: error?.config?.url,
          baseURL: error?.config?.baseURL,
          method: error?.config?.method,
          data: error?.config?.data
            ? {
                ...JSON.parse(error?.config?.data),
                firebaseIdToken:
                  JSON.parse(error?.config?.data)?.firebaseIdToken?.substring(
                    0,
                    20,
                  ) + "...",
              }
            : undefined,
        },
        isNetworkError: error?.message === "Network Error",
        fullError: error,
      });

      let errorMessage = "구글 로그인 중 오류가 발생했습니다.";
      if (error?.message === "Network Error") {
        errorMessage =
          "네트워크 연결에 실패했습니다.\n앱을 다시 빌드했는지 확인해주세요.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("로그인 실패", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
          <Text style={styles.appName}>Nemonemo</Text>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <GoogleAuthButton onPress={handleGoogleLogin} />

          {Platform.OS === "ios" && <AppleAuth />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  logo: {
    width: 88,
    height: 88,
    backgroundColor: "#D9D9D9",
    marginBottom: globalSpacingSm,
  },
  appName: {
    fontSize: 24,
    fontWeight: "600",
    color: globalGreen300,
    fontFamily: "Pretendard-Regular",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 480,
    gap: 40,
  },
});

export default AuthScreen;
