import auth from "@react-native-firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { socialLogin } from "../api/auth";
import { setPendingSocialLogin } from "../utils/pendingSocialLogin";
import { saveAccessToken, saveRefreshToken } from "../utils/tokenStorage";

export default function AppleAuth() {
  const router = useRouter();

  const appleSignIn = useCallback(async () => {
    try {
      console.log("[AppleAuth] signIn start");
      if (Platform.OS !== "ios") return;

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      console.log("[AppleAuth] isAvailable:", isAvailable);

      if (!isAvailable) {
        console.error("Apple 로그인을 사용할 수 없습니다.");
        return;
      }

      const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error("Apple ID Token을 가져오지 못했습니다.");
      }

      const appleCredentials = auth.AppleAuthProvider.credential(identityToken);
      const userCredential =
        await auth().signInWithCredential(appleCredentials);

      const firebaseIdToken = await userCredential.user.getIdToken();

      const clientType = Platform.OS === "ios" ? "IOS" : "ANDROID";
      const deviceType = Platform.OS === "ios" ? "iOS" : "Android";

      console.log("[AppleAuth] socialLogin request:", {
        provider: "APPLE",
        firebaseIdToken,
        clientType,
        deviceType,
      });

      const response = await socialLogin({
        provider: "APPLE",
        firebaseIdToken,
        clientType,
        deviceType,
      });

      console.log("[AppleAuth] socialLogin response:", response);

      if (response.newUser === true) {
        await setPendingSocialLogin({
          provider: "APPLE",
          firebaseIdToken,
          clientType,
          deviceType,
        });
        router.push("/auth/signup");
        return;
      }

      if (
        typeof response.accessToken !== "string" ||
        typeof response.refreshToken !== "string"
      ) {
        throw new Error(
          "로그인 토큰을 받지 못했습니다. 서버 응답 스펙을 확인해 주세요."
        );
      }

      await saveAccessToken(response.accessToken);
      await saveRefreshToken(response.refreshToken);
      router.push("/0");
    } catch (error: any) {
      if (error?.code === "ERR_REQUEST_CANCELED") return;

      let errorMessage = "애플 로그인 중 오류가 발생했습니다.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      console.error("로그인 실패:", errorMessage);
      console.error("애플 로그인 실패 - 상세 에러:", {
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
                firebaseIdToken: JSON.parse(error?.config?.data)
                  ?.firebaseIdToken,
              }
            : undefined,
        },
        isNetworkError: error?.message === "Network Error",
        fullError: error,
      });
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={10}
        style={styles.button}
        onPress={appleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 55,
  },
});
