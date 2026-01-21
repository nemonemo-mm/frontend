import ChevronLeftIcon from "@/assets/icons/chevron-left";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import EditProfileImage from "@/shared/ui/molecules/EditProfileImage";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSetupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ChevronLeftIcon />
      </View>

      {/* 상단 텍스트 및 프로필 이미지 영역 */}
      <View style={styles.topSection}>
        <NemoText level="h1">팀 정보를 입력해 주세요</NemoText>
        <View style={styles.ImageWrapper}>
          <EditProfileImage
            size={100}
            onEditPress={() => {}}
            imageUri={undefined}
            variant="team"
          />
        </View>
      </View>

      {/* 입력 폼 영역 */}
      <View style={styles.formContainer}>
        <View>
          <Input placeholder="팀 이름을 입력해 주세요" label="팀 이름" />
        </View>
        <View>
          <Input
            placeholder="팀을 소개하는 한 줄을 적어보세요 (선택)"
            label="팀 소개"
          />
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomSection}>
        <CtaButton label="다음으로" onPress={() => {}} isActive={false} />
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
