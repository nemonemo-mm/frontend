import ChevronLeftIcon from "@/assets/icons/chevron-left";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import Chips from "@/shared/ui/molecules/Chips";
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
        <NemoText level="h1">팀 내 프로필을 정해 주세요</NemoText>
        <View style={styles.ImageWrapper}>
          <EditProfileImage
            size={100}
            onEditPress={() => {}}
            imageUri={undefined}
          />
        </View>
      </View>

      {/* 입력 폼 영역 */}
      <View style={styles.formContainer}>
        <View>
          <Input placeholder="이름을 입력해 주세요" label="이름" />
        </View>
        <View style={styles.chipsContainer}>
          <NemoText level="body1">팀 내 포지션</NemoText>
          <Chips
            texts={[
              { id: "1", content: "BE", isActive: false },
              { id: "2", content: "UX", isActive: false },
              { id: "3", content: "FE", isActive: false },
            ]}
            handler={() => {}}
          />
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomSection}>
        <CtaButton label="가입하기" onPress={() => {}} isActive={false} />
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
