import { globalGray0, globalGreen300 } from "@/shared/ui";
import Button from "@/shared/ui/atoms/Button";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinCodeInputScreen() {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <NemoText level="h1">참여코드를 입력해 주세요</NemoText>
        <Input
          placeholder="초대 코드를 입력해 주세요"
        />
      </View>
      <Button style={[styles.button, { backgroundColor: globalGreen300 }]}>
          <NemoText level="h2" style={{ color: globalGray0 }}>팀 검색하기</NemoText>
        </Button>
    </SafeAreaView>
  );
};

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
  button: {
    marginHorizontal: 20,
    minHeight: 46,
    marginBottom: 20,
  },
});
