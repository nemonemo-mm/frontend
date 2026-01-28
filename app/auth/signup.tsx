import { patchPendingSocialLogin } from "@/features/auth/utils/pendingSocialLogin";
import { globalSpacing2xl, globalSpacingProfile } from "@/shared/ui";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  const handleNext = useCallback(async () => {
    const trimmedUserName = userName.trim();
    if (!trimmedUserName) return;

    await patchPendingSocialLogin({ userName: trimmedUserName });

    router.push("/auth/permission" as any);
  }, [router, userName]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <NemoText level="h1" style={{ paddingBottom: 36 }}>
            앱에서 사용할 이름을 입력해 주세요.
          </NemoText>
        </View>

        <Input
          label="이름"
          placeholder="이름을 입력해 주세요."
          value={userName}
          onChangeText={setUserName}
          maxLength={10}
        />
      </View>

      <CtaButton
        label="가입하기"
        onPress={handleNext}
        isActive={!!userName.trim()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 140,
    marginHorizontal: 20,
    gap: globalSpacing2xl,
  },
  profile: {
    alignItems: "center",
    gap: globalSpacingProfile,
  },
});

export default SignupScreen;
