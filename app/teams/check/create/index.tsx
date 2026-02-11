import ChevronLeftIcon from "@/assets/icons/chevron-left";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import NemoInput from "@/shared/ui/molecules/NemoInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSetupScreen() {
  const router = useRouter();

  const [form, setForm] = useState<{
    teamName: string;
    teamIntroduction?: string;
  }>({
    teamName: "",
    teamIntroduction: "",
  });

  const handleTeamNameChange = (text: string) => {
    setForm((prev) => ({ ...prev, teamName: text }));
  };

  const handleTeamIntroductionChange = (text: string) => {
    setForm((prev) => ({ ...prev, teamIntroduction: text }));
  };

  const handleNext = () => {
    if (!form.teamName.trim()) return;
    router.push({
      pathname: "/teams/check/create/position",
      params: {
        teamName: form.teamName,
        teamIntroduction: form.teamIntroduction || "",
      },
    });
  };

  // 팀 이름이 있으면 버튼 활성화
  const isFormValid = form.teamName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeftIcon />
        </Pressable>
      </View>

      {/* 상단 텍스트 및 프로필 이미지 영역 */}
      <View style={styles.topSection}>
        <NemoText level="h1">팀 정보를 입력해 주세요</NemoText>

        {/* TODO: 팀 이미지 업로드 기능 추가 */}
        {/* <View style={styles.ImageWrapper}>
          <EditProfileImage
            size={100}
            onEditPress={() => {}}
            imageUri={undefined}
            variant="team"
          />
        </View> */}
      </View>

      {/* 입력 폼 영역 */}
      <View style={styles.formContainer}>
        <View>
          <NemoInput
            placeholder="팀 이름을 입력해 주세요"
            label="팀 이름"
            value={form.teamName}
            onChangeText={handleTeamNameChange}
          />
        </View>
        <View>
          <NemoInput
            placeholder="팀을 소개하는 한 줄을 적어보세요 (선택)"
            maxLength={20}
            label="팀 소개"
            value={form.teamIntroduction || ""}
            onChangeText={handleTeamIntroductionChange}
          />
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomSection}>
        <CtaButton
          label="다음으로"
          onPress={handleNext}
          isActive={isFormValid}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    height: 56,
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 8,
  },
  ImageWrapper: {
    paddingTop: 36,
  },
  formContainer: {
    flex: 1,
    gap: 12,
    marginTop: 30,
  },
  chipsContainer: {
    gap: 12,
    marginHorizontal: 20,
  },
  bottomSection: {
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 20,
    minHeight: 46,
  },
});
