import ChevronLeftIcon from "@/assets/icons/chevron-left";
import TeamManagement from "@/features/team/components/TeamManagement";
import TeamMembersList from "@/features/team/components/TeamMembersList";
import { useTeamMembers } from "@/features/team/hooks/useTeamMembers";
import NemoText from "@/shared/ui/atoms/NemoText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { teamDetailInfo } from "@/features/team/api/detail";
import type { TeamDetail } from "@/features/team/types/team.model";
import TeamTabs from "@/shared/ui/molecules/TeamTabs";
import { useQuery } from "@tanstack/react-query";

export default function TeamMembersScreen() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();

  const parsedTeamId = teamId ? Number(teamId) : null;
  const { data: teamData, isLoading, isError } = useTeamMembers(parsedTeamId);

  const { data: teamDetail } = useQuery<TeamDetail>({
    queryKey: ["teamDetail", parsedTeamId],
    queryFn: () => teamDetailInfo(parsedTeamId!),
    enabled: !!parsedTeamId,
  });

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, content: "팀원", isActive: activeTab === 0 },
    ...(teamDetail?.isOwner
      ? [{ id: 1, content: "팀 관리", isActive: activeTab === 1 }]
      : []),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ChevronLeftIcon size={16} />
          <NemoText level="h3">{teamData?.teamName}</NemoText>
        </Pressable>
      </View>

      <View style={styles.tabsContainer}>
        <TeamTabs texts={tabs} handler={(id) => setActiveTab(id)} />
      </View>

      {activeTab === 0 && (
        <TeamMembersList
          members={teamData?.members}
          isLoading={isLoading}
          isError={isError}
          teamId={parsedTeamId}
          isOwner={teamDetail?.isOwner}
        />
      )}

      {activeTab === 1 && <TeamManagement teamId={parsedTeamId} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginHorizontal: 20,
  },
  container: {
    justifyContent: "center",
    height: 56,
    marginBottom: 8,
  },
  tabsContainer: {
    gap: 9,
    marginBottom: 8,
  },
});
