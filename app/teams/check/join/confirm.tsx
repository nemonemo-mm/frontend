import {
  globalGray0,
  globalGray150,
  globalGray400,
  globalGreen300,
} from "@/shared/ui";
import Button from "@/shared/ui/atoms/Button";
import NemoText from "@/shared/ui/atoms/NemoText";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinConfirmScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <NemoText level="h1">이 팀에 참여할까요?</NemoText>
        <Image
          source={require("@/assets/icons/group.png")}
          style={{ width: 90, height: 84 }}
        />
        <View style={styles.teamNameContainer}>
          <NemoText level="body1">팀 이름 |</NemoText>
          <NemoText level="body1">내 이름</NemoText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, { backgroundColor: globalGreen300 }]}
          onPress={() => router.push("/teams/check/join/confirm")}
          disabled={false}
        >
          <NemoText level="h2" style={{ color: globalGray0 }}>
            네, 맞아요
          </NemoText>
        </Button>
        <Button
          style={[styles.button, { backgroundColor: globalGray150 }]}
          onPress={() => router.push("/teams/check/join/confirm")}
          disabled={false}
        >
          <NemoText level="h2" style={{ color: globalGray400 }}>
            아니에요
          </NemoText>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 20,
    gap: 36,
  },
  teamNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buttonContainer: {
    gap: 9,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    minHeight: 46,
  },
});
