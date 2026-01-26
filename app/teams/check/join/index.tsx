import ChevronLeftIcon from "@/assets/icons/chevron-left";
import { getTeamByInviteCode } from "@/features/team/api/invite";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinCodeInputScreen() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");

  const handleSearch = async () => {
    const trimmedCode = inviteCode.trim();
    if (!trimmedCode) return;

    try {
      const { data } = await getTeamByInviteCode(trimmedCode);
      router.push({
        pathname: "/teams/check/join/confirm",
        params: {
          inviteCode: trimmedCode,
          teamName: data.teamName,
          ownerName: data.ownerName,
        },
      });
    } catch (error: any) {
      if (error.response?.data?.code === "INVALID_INVITE_CODE") {
        console.log("유효하지 않은 초대 코드");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <NemoText level="h1">참여코드를 입력해 주세요</NemoText>
        <Input
          placeholder="초대 코드를 입력해 주세요"
          value={inviteCode}
          onChangeText={setInviteCode}
        />
      </View>
      <CtaButton
        label="팀 검색하기"
        onPress={handleSearch}
        isActive={inviteCode.length > 0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
