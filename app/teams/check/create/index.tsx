import ChevronLeftIcon from "@/assets/icons/chevron-left";
import { teamCreate } from "@/features/team/api/create";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import EditProfileImage from "@/shared/ui/molecules/EditProfileImage";
import ImageUploadModal from "@/shared/ui/molecules/ImageUploadModal";
import NemoInput from "@/shared/ui/molecules/NemoInput";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
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
  const [isImageSheetOpen, setIsImageSheetOpen] = useState(false);
  const [localTeamImageUri, setLocalTeamImageUri] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTeamNameChange = (text: string) => {
    setForm((prev) => ({ ...prev, teamName: text }));
  };

  const handleTeamIntroductionChange = (text: string) => {
    setForm((prev) => ({ ...prev, teamIntroduction: text }));
  };

  const handlePickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalTeamImageUri(asset.uri);
    }
    setIsImageSheetOpen(false);
  };

  const handlePickLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalTeamImageUri(asset.uri);
    }
    setIsImageSheetOpen(false);
  };

  const handleCreate = async () => {
    if (!form.teamName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await teamCreate({
        teamName: form.teamName.trim(),
        ...(form.teamIntroduction?.trim() && {
          description: form.teamIntroduction.trim(),
        }),
        ...(localTeamImageUri && {
          imageUrl: localTeamImageUri,
        }),
      });

      router.replace(`/${response.teamId}/calendar`);
    } catch (error: any) {
      console.error("팀 생성 실패:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "팀 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      Alert.alert("팀 생성 실패", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 팀 이름이 있으면 버튼 활성화
  const isFormValid = form.teamName.trim().length > 0 && !isSubmitting;

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

        <View style={styles.imageWrapper}>
          <EditProfileImage
            size={90}
            variant="team"
            imageUri={localTeamImageUri ?? undefined}
            onEditPress={() => setIsImageSheetOpen(true)}
          />
        </View>
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
          label="생성하기"
          onPress={handleCreate}
          isActive={isFormValid}
        />
      </View>

      <ImageUploadModal
        visible={isImageSheetOpen}
        onClose={() => setIsImageSheetOpen(false)}
        onPressCamera={handlePickCamera}
        onPressLibrary={handlePickLibrary}
      />
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
  imageWrapper: {
    paddingTop: 36,
  },
  formContainer: {
    flex: 1,
    gap: 12,
    marginTop: 30,
  },
  bottomSection: {
    marginBottom: 20,
  },
});
