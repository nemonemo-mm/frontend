import { globalGray0, globalGreen300 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <NemoText level="h1">잘못된 접근이에요</NemoText>
      <NemoText level="body2" style={styles.description}>
        현재 팀에 접근할 수 없으니 홈으로 이동해 주세요.
      </NemoText>

      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>홈으로 가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f7f8fa",
    gap: 8,
  },
  description: {
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: globalGreen300,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: globalGray0,
  },
});
