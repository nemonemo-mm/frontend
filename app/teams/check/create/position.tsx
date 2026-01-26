import ChevronLeftIcon from "@/assets/icons/chevron-left";
import Chip from "@/shared/ui/atoms/Chip";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import AddPositionModal from "@/shared/ui/templates/AddPositionModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Position {
  positionName: string;
  colorHex: string;
}

export default function PositionScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    teamName: string;
    teamIntroduction: string;
  }>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionName, setSelectedPositionName] = useState<
    string | null
  >(null);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleAddPosition = (positionName: string, colorHex: string) => {
    setPositions((prev) => [...prev, { positionName, colorHex }]);
    setIsModalOpen(false);
  };

  const handlePositionSelect = (positionName: string) => {
    setSelectedPositionName(positionName);
  };

  const handleNext = () => {
    router.push({
      pathname: "/teams/check/create/complete",
      params: {
        teamName: params.teamName,
        teamIntroduction: params.teamIntroduction || "",
        positions: JSON.stringify(positions),
        ownerPositionName: selectedPositionName || "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ChevronLeftIcon />
      </View>

      <View style={styles.content}>
        <NemoText level="h1">포지션을 만들어 볼까요?</NemoText>
      </View>

      <View style={styles.chipContainer}>
        {positions.map((position, index) => (
          <Chip
            key={index}
            active={selectedPositionName === position.positionName}
            onPress={() => handlePositionSelect(position.positionName)}
          >
            <NemoText level="body2">{position.positionName}</NemoText>
          </Chip>
        ))}

        <Chip active={true} onPress={handleModalOpen}>
          <NemoText level="body2">추가하기</NemoText>
        </Chip>
      </View>

      <AddPositionModal
        visible={isModalOpen}
        closeModal={handleModalClose}
        onAddPosition={handleAddPosition}
      />

      <View style={styles.bottomSection}>
        <CtaButton label="다음으로" onPress={handleNext} isActive={true} />
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
  },
  content: {
    alignItems: "center",
  },
  chipContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginHorizontal: 20,
  },
  bottomSection: {
    marginBottom: 20,
  },
});
