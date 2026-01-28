import ChevronLeftIcon from "@/assets/icons/chevron-left";
import GroupIcon from "@/assets/icons/group";
import { teamCreate } from "@/features/team/api/create";
import Chip from "@/shared/ui/atoms/Chip";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Position {
  positionName: string;
  colorHex: string;
}

export default function CompleteScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    teamName: string;
    teamIntroduction: string;
    positions: string;
    ownerPositionName: string;
  }>();

  // positions를 파싱
  const positions: Position[] = params.positions
    ? JSON.parse(params.positions as string)
    : [];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const requestBody = {
        teamName: params.teamName.trim(),
        ...(params.teamIntroduction?.trim() && {
          description: params.teamIntroduction.trim(),
        }),
        positions: positions,
        ownerPositionName: params.ownerPositionName,
      };

      const response = await teamCreate(requestBody);
      console.log("팀 생성 성공 응답:", response);

      // 성공 후 홈 화면으로 이동
      router.replace(`/(tabs)/${response.teamId}/calendar`);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ChevronLeftIcon />
      </View>

      {/* 상단 텍스트 및 프로필 이미지 영역 */}
      <View style={styles.topSection}>
        <NemoText level="h1">생성될 팀 정보를 확인해 주세요</NemoText>
        <View style={styles.ImageWrapper}>
          <GroupIcon width={90} height={84} />
        </View>
      </View>

      {/* 입력 폼 영역 */}
      <View style={styles.formContainer}>
        <View>
          <Input
            placeholder="팀 이름을 입력해 주세요"
            label="팀 이름"
            value={params.teamName || ""}
            editable={false}
          />
        </View>

        {params.teamIntroduction?.trim() && (
          <View>
            <Input
              placeholder="팀을 소개하는 한 줄을 적어보세요 (선택)"
              label="팀 소개"
              value={params.teamIntroduction}
              editable={false}
            />
          </View>
        )}
      </View>

      {positions.length > 0 && (
        <View style={styles.chipsContainer}>
          <NemoText level="body1">팀 내 포지션</NemoText>

          {positions.map((position, index) => (
            <Chip key={index} active={true} onPress={() => {}}>
              <NemoText level="body2">{position.positionName}</NemoText>
            </Chip>
          ))}
        </View>
      )}

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomSection}>
        <CtaButton
          label="생성하기"
          onPress={handleCreate}
          isActive={!isSubmitting && !!params.teamName?.trim()}
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
    flex: 1,
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
