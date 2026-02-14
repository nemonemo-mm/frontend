import {
  useAlertMutations,
  useAlerts,
} from "@/features/notifications/hooks/useAlert";
import { useTeamList } from "@/features/team/hooks/useTeamList";
import {
  globalGray0,
  globalGray400,
  globalGray500,
  globalGray700,
  globalGray900,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import Tab from "@/shared/ui/atoms/Tab";
import { getAlertNavigationTarget } from "@/shared/utils/alertNavigation";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AlarmScreenProps {}
interface AlarmTabItem {
  id: number | null;
  content: string;
  isActive: boolean;
}

const AlarmScreen = ({}: AlarmScreenProps) => {
  const route = useRouter();
  const alertQuery = useAlerts();
  const teamQuery = useTeamList();
  const { markAsRead } = useAlertMutations();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const alarms = alertQuery.data ?? [];
  const teams = teamQuery.data ?? [];
  const tabList = useMemo<AlarmTabItem[]>(
    () => [
      { id: null, content: "전체", isActive: selectedTeamId == null },
      ...teams.map((team) => ({
        id: team.teamId,
        content: team.teamName,
        isActive: selectedTeamId === team.teamId,
      })),
    ],
    [selectedTeamId, teams]
  );

  const filteredAlarms = useMemo(
    () =>
      selectedTeamId == null
        ? alarms
        : alarms.filter((alarm) => alarm.teamId === selectedTeamId),
    [alarms, selectedTeamId]
  );

  const handlePressTab = (teamId: number | null) => () => {
    setSelectedTeamId(teamId);
  };

  const handlePressAlert =
    (alertId: number, type: string, teamId: number, read: boolean) => () => {
      if (!read) markAsRead.mutate(alertId);

      const target = getAlertNavigationTarget({ type, teamId });
      if (!target) return;

      if (target.method === "replace") {
        route.replace(target.href as Href);
        return;
      }

      route.push(target.href as Href);
    };
  return (
    <SafeAreaView style={[filteredAlarms.length == 0 && styles.container]}>
      <Pressable style={styles.header} onPress={() => route.back()}>
        <AntDesign name="left" size={16} color={globalGray700} />
        <NemoText level="h2">알림</NemoText>
      </Pressable>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabListContent}
        data={tabList}
        keyExtractor={(item) => `team-${item.id ?? "all"}`}
        renderItem={({ item }) => (
          <View style={styles.tabItem}>
            <Tab onPress={handlePressTab(item.id)} isActive={item.isActive}>
              {item.content}
            </Tab>
          </View>
        )}
      />
      <FlatList
        contentContainerStyle={[styles.listContent]}
        data={filteredAlarms}
        keyExtractor={(item) => `alarm-${item.id}`}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <NemoText level="body2" style={{ color: globalGray900 }}>
              아직 새로운 알림이 없어요
            </NemoText>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.alarmContainer}
            onPress={handlePressAlert(
              item.id,
              item.type,
              item.teamId,
              item.isRead
            )}
          >
            <NemoText
              level="body2"
              style={{ color: item.readAt ? globalGray500 : globalGray900 }}
            >
              {item.content}
            </NemoText>
            <NemoText
              level="body3"
              style={{ color: item.readAt ? globalGray400 : globalGray700 }}
            >
              {item.teamName}
              {" • "}
              {new Date(item.time).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </NemoText>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  tabListContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  tabItem: {
    marginRight: 16,
  },
  alarmContainer: {
    backgroundColor: globalGray0,
    borderRadius: globalSpacingXs,
    padding: globalSpacingXs,
    gap: globalSpacingXs,
    marginBottom: 8,
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AlarmScreen;
