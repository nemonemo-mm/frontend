import ChevronLeftIcon from "@/assets/icons/chevron-left";
import Chip from "@/shared/ui/atoms/Chip";
import NemoText from "@/shared/ui/atoms/NemoText";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PositionScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ChevronLeftIcon />
      </View>

      <View style={styles.content}>
        <NemoText level="h1">포지션을 만들어 볼까요?</NemoText>
      </View>

      <View style={styles.chipContainer}>
        <Chip active={true} onPress={() => {}}>
          <NemoText level="body2">추가하기</NemoText>
        </Chip>
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
  content: {
    alignItems: "center",
  },
  chipContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
