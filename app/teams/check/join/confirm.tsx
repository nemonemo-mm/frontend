import ChevronLeftIcon from "@/assets/icons/chevron-left";
import GroupIcon from "@/assets/icons/group";
import { getTeamByInviteCode } from "@/features/team/api/invite";
import { TeamInfoResponse } from "@/features/team/types/team.model";
import {
  globalGray0,
  globalGray150,
  globalGray400,
  globalGreen300,
} from "@/shared/ui";
import Button from "@/shared/ui/atoms/Button";
import NemoText from "@/shared/ui/atoms/NemoText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    inviteCode: string;
    teamName: string;
    ownerName: string;
  }>();
  const [teamInfo, setTeamInfo] = useState<TeamInfoResponse | null>(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!params.inviteCode) return;

      try {
        const { data } = await getTeamByInviteCode(params.inviteCode);
        setTeamInfo(data);
      } catch (error) {
        console.error("팀 정보 조회 실패:", error);
      }
    };

    fetchTeamInfo();
  }, [params.inviteCode]);

  const handleConfirm = () => {
    if (!teamInfo) return;

    router.push({
      pathname: "/teams/check/join/profile-setup",
      params: {
        inviteCode: params.inviteCode,
        teamName: teamInfo.teamName,
        positions: JSON.stringify(teamInfo.positions),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <NemoText level="h1">이 팀에 참여할까요?</NemoText>

        <GroupIcon width={90} height={84} />

        <View style={styles.teamNameContainer}>
          <NemoText level="body1">{params.teamName}</NemoText>
          <NemoText level="body1">· {params.ownerName}</NemoText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, { backgroundColor: globalGreen300 }]}
          onPress={handleConfirm}
          disabled={!teamInfo}
        >
          <NemoText level="h2" style={{ color: globalGray0 }}>
            네, 맞아요
          </NemoText>
        </Button>
        <Button
          style={[styles.button, { backgroundColor: globalGray150 }]}
          onPress={() => router.push("/teams/check/join")}
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
