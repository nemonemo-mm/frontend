import ChevronLeftIcon from "@/assets/icons/chevron-left";
import { teamJoin } from "@/features/team/api/join";
import { Position } from "@/features/team/types/team.model";
import NemoText from "@/shared/ui/atoms/NemoText";
import Chips from "@/shared/ui/molecules/Chips";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ChipText = {
  id: string;
  content: string;
  isActive: boolean;
};

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    inviteCode: string;
    teamName: string;
    positions: string;
  }>();

  const positions: Position[] = params.positions
    ? JSON.parse(params.positions)
    : [];

  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(
    null
  );

  const [chipData, setChipData] = useState<ChipText[]>(
    positions.map((position) => ({
      id: String(position.positionId),
      content: position.positionName,
      isActive: false,
    }))
  );

  const handlePositionSelect = (items: ChipText[]) => {
    // 가장 최근에 활성화된 항목만 찾기
    const newActiveItem = items.find((item, index) => {
      const prevItem = chipData[index];
      return item.isActive && (!prevItem || !prevItem.isActive);
    });

    if (newActiveItem) {
      // 단일 선택을 위해 다른 모든 항목 비활성화
      const updatedItems = items.map((item) => ({
        ...item,
        isActive: item.id === newActiveItem.id,
      }));
      setChipData(updatedItems);
      setSelectedPositionId(Number(newActiveItem.id));
    } else {
      // 선택 해제
      const hasAnyActive = items.some((item) => item.isActive);
      if (!hasAnyActive) {
        setChipData(items);
        setSelectedPositionId(null);
      }
    }
  };

  const handleJoin = async () => {
    if (!selectedPositionId || !params.inviteCode) return;

    try {
      await teamJoin({
        inviteCode: params.inviteCode,
        positionId: selectedPositionId,
      });

      // 성공 시 홈 화면으로 이동
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("팀 참여 실패:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon />
        </TouchableOpacity>
      </View>

      {/* 상단 텍스트 및 프로필 이미지 영역 */}
      <View style={styles.topSection}>
        <NemoText level="h1">팀 내 프로필을 정해 주세요</NemoText>
      </View>

      {/* 입력 폼 영역 */}
      <View style={styles.formContainer}>
        <View style={styles.chipsContainer}>
          <NemoText level="body1">팀 내 포지션</NemoText>
          <Chips texts={chipData} handler={handlePositionSelect} />
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomSection}>
        <CtaButton
          label="참여하기"
          onPress={handleJoin}
          isActive={selectedPositionId !== null}
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
