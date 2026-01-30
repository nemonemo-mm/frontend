import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useCallback, useMemo, useRef, useState } from "react";

function ensureGoogleConfigured() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    throw new Error("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID가 설정되지 않았습니다.");
  }
  GoogleSignin.configure({
    webClientId,
  });
}

function getGoogleIdToken(signInResult: any): string | null {
  return signInResult?.data?.idToken ?? signInResult?.idToken ?? null;
}

export type GoogleLoginResult = {
  firebaseIdToken: string;
  provider: "GOOGLE";
  email: string | null;
  photoURL: string | null;
};

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const configuredRef = useRef(false);

  const login = useCallback(async (): Promise<GoogleLoginResult | null> => {
    if (isLoading) return null;

    setIsLoading(true);
    try {
      if (!configuredRef.current) {
        ensureGoogleConfigured();
        configuredRef.current = true;
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      const googleIdToken = getGoogleIdToken(signInResult);
      if (!googleIdToken)
        throw new Error("Google ID Token을 가져오지 못했습니다.");

      const credential = auth.GoogleAuthProvider.credential(googleIdToken);
      const userCredential = await auth().signInWithCredential(credential);

      const firebaseIdToken = await userCredential.user.getIdToken();

      return {
        firebaseIdToken,
        provider: "GOOGLE",
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      };
    } catch (err) {
      if (isErrorWithCode(err)) {
        if (err.code === statusCodes.SIGN_IN_CANCELLED) return null;
        if (err.code === statusCodes.IN_PROGRESS) return null;
        if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          throw new Error("Google Play Services를 사용할 수 없습니다.");
        }
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return useMemo(() => ({ login, isLoading }), [login, isLoading]);
}
