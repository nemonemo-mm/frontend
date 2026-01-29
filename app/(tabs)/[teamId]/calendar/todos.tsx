import { useTeamSchedules } from "@/features/calendar/hooks/useSchedules";
import { useTeamTodos } from "@/features/calendar/hooks/useTodos";
import { TeamDetail } from "@/features/team/types/team.model";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import Checkbox from "@/shared/ui/atoms/Checkbox";
import NemoText from "@/shared/ui/atoms/NemoText";
import CalendarDays from "@/shared/ui/molecules/CalendarDays";
import CalendarWeek from "@/shared/ui/molecules/CalendarWeek";
import { EvilIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

interface TodosProps {}

const formatDateString = (date: string): string => {
  const oldDate = new Date(date);
  const newDate =
    (oldDate.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    oldDate.getDate();

  return newDate;
};

const Todos = ({}: TodosProps) => {
  const calendarContext = useContext(CalendarContext);
  const today = new Date(Date.now());
  const { teamId } = useLocalSearchParams();
  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }
  const [info, setInfo] = useState<TeamDetail | null>(null);
  useEffect(() => {
    const init = async () => {
      const data = await AsyncStorage.getItem("currentTeam");
      if (data) setInfo(JSON.parse(data) as TeamDetail);
    };
    init();
  }, [teamId]);

  const { days, schedules, todos, selectedDate } = calendarContext;

  const thisWeek = days
    .filter((day) =>
      day.some(
        (d) =>
          d.fullDate.getDate() == today.getDate() &&
          d.fullDate.getMonth() == today.getMonth()
      )
    )
    .flat();
  const start = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    0,
    0,
    0,
    -1
  ).toISOString();

  const end = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    23,
    59,
    59,
    999
  ).toISOString();

  const todayScheduleQuery = useTeamSchedules(parseInt(teamId as string), {
    start,
    end,
  });
  const todaySchedule = todayScheduleQuery.data;

  const todayTodoQuery = useTeamTodos(parseInt(teamId as string), {
    start,
    end,
  });
  const todayTodos = todayTodoQuery.data;
  return (
    <View>
      <CalendarDays />
      <CalendarWeek dates={thisWeek} schedules={[...schedules, ...todos]} />

      <View style={styles.container}>
        <Pressable style={styles.btn} onPress={() => {}}>
          <EvilIcons name="plus" size={20} color="black" />
        </Pressable>
        <NemoText level="h2">{info?.teamName}의 스케줄</NemoText>

        <FlatList
          data={todaySchedule ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.scheduleContainer}>
              <View
                style={{
                  width: 1,
                  backgroundColor: item.representativeColorHex,
                }}
              />
              <NemoText level="body1">
                {formatDateString(item.startAt)} ~{" "}
                {formatDateString(item.endAt)}
              </NemoText>
              <NemoText level="body1">{item.title}</NemoText>
              <NemoText level="body1">{item.description}</NemoText>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NemoText level="body2">오늘 스케줄이 없습니다.</NemoText>
            </View>
          }
        />
      </View>

      <View style={styles.container}>
        <NemoText level="h2">{info?.teamName}의 할 일</NemoText>

        <FlatList
          data={todayTodos ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.scheduleContainer}>
              <View
                style={{
                  width: 1,
                  backgroundColor: item.representativeColorHex,
                }}
              />
              <NemoText level="body1">{item.assigneeMemberUserName}</NemoText>
              <NemoText level="body1">{item.title}</NemoText>
              <NemoText level="body1">{item.description}</NemoText>
              <View style={{ margin: "auto" }} />
              <Checkbox value={true} handler={() => {}} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <NemoText level="body2">오늘 할 일이 없습니다.</NemoText>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    gap: 16,
    position: "relative",
  },
  scheduleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  emptyContainer: {
    minHeight: 200,
    flex: 1,
    margin: "auto",
  },
  btn: {
    position: "absolute",
    right: 0,
  },
});
export default Todos;
