import {
  globalGray0,
  globalGray150,
  globalGray400,
  globalGreen300,
} from "@/shared/ui";
import Button from "@/shared/ui/atoms/Button";
import NemoText from "@/shared/ui/atoms/NemoText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamExistenceCheckScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <NemoText level="h1">팀이 있나요?</NemoText>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={[styles.button, { backgroundColor: globalGreen300 }]}>
          <NemoText level="h2" style={{ color: globalGray0 }}>
            새로운 팀 만들기
          </NemoText>
        </Button>
        <Button
          style={[styles.button, { backgroundColor: globalGray150 }]}
          onPress={() => router.push("/teams/check/join")}
        >
          <NemoText level="h2" style={{ color: globalGray400 }}>
            초대 코드가 있어요
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 20,
  },
  buttonContainer: {
    gap: 9,
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 20,
    minHeight: 46,
  },
});
