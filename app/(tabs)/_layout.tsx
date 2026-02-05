import MainIcon from "@/assets/icons/main";
import MyPageIcon from "@/assets/icons/mypage";
import { useScheduleMutations } from "@/features/calendar/hooks/useSchedules";
import { useTodoMutations } from "@/features/calendar/hooks/useTodos";
import { ScheduleRequest } from "@/features/calendar/types/schedule.model";
import { TodoRequest } from "@/features/calendar/types/todo.model";
import useCalendar from "@/shared/hooks/useCalendar";
import type { InitialCalendarState } from "@/shared/hooks/useCalendarForm";
import { globalGray50, globalGreen300 } from "@/shared/ui";
import { WeekDayType } from "@/shared/ui/molecules/NemoDayButton";
import CalendarModal from "@/shared/ui/templates/CalendarModal";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCallback, useState } from "react";
const today = new Date(Date.now());
const year = today.getFullYear();
const month = today.getMonth();
export default function TabsLayout() {
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const handleOpenCalendarModal = () => {
    setSelectedDate(new Date());
    setIsCalendarModalVisible(true);
  };

  const handleCloseCalendarModal = () => {
    setIsCalendarModalVisible(false);
  };

  const { createSchedule } = useScheduleMutations();

  const { createTodo } = useTodoMutations();

  const { goNextMonth, goPrevMonth, days, currentYearMonth } = useCalendar(
    year,
    month
  );
  // const schedulesQuery = useTeamSchedules(parseInt(teamId as string), {
  //   start: new Date(
  //     currentYearMonth.year,
  //     currentYearMonth.month - 1,
  //     1
  //   ).toISOString(),
  //   end: new Date(
  //     currentYearMonth.year,
  //     currentYearMonth.month + 2,
  //     0
  //   ).toISOString(),
  // });

  // const todosQuery = useTeamTodos(parseInt(teamId as string), {
  //   start: new Date(
  //     currentYearMonth.year,
  //     currentYearMonth.month - 1,
  //     1
  //   ).toISOString(),
  //   end: new Date(
  //     currentYearMonth.year,
  //     currentYearMonth.month + 2,
  //     0
  //   ).toISOString(),
  // });

  // const calendarSchedules = convertSchedules(schedulesQuery.data);
  // const calendarTodos = convertTodos(todosQuery.data);

  // const { data: teamDetail } = useTeamDetail(
  //   teamId ? parseInt(teamId as string) : null
  // );

  const [selectedDate, setSelectedDate] = useState(today);
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // const callSchedules = useCallback(() => {
  //   schedulesQuery.refetch();
  // }, [schedulesQuery]);

  // const callTodos = useCallback(() => {
  //   todosQuery.refetch({});
  // }, [todosQuery]);

  const handleConfirmCalendarModal = (data: {
    id: string;
    state: InitialCalendarState;
  }) => {
    const {
      teamId,
      title,
      description,
      url,
      start,
      end,
      person,
      position,
      repeat,
      alarm,
      isAllDay,
    } = data.state;
    const positionIds = position
      .filter((pos) => pos.isActive)
      .map((pos) => pos.positionId);
    const attendeeMemberIds = person
      .filter((per) => per.isActive)
      .map((per) => per.memberId);
    const repeatType = repeat?.period ?? "NONE";
    let repeatEndDate = null;
    let repeatInterval: number | null = null;
    let repeatWeekDays: WeekDayType[] | null = null;
    let repeatUseDate: boolean = false;
    if (repeat) {
      repeatEndDate = repeat.endAt.toISOString();
      if (repeat.period == "daily") {
        repeatInterval = repeat.interval;
      }
      if (repeat.period == "weekly") {
        repeatInterval = repeat.interval;
        repeatWeekDays = repeat.weekdays;
      }
      if (repeat.period == "monthly" || repeat.period == "yearly") {
        repeatUseDate = repeat.useDate;
      }
    }
    const notificationMinutes: number[] = alarm
      ? Object.entries(alarm)
          .map(([key, value]) => {
            if (value) return parseInt(key);
            else return null;
          })
          .filter((val): val is number => val !== null)
      : [];
    if (data.id == "schedule") {
      const req = {
        teamId,
        title,
        description,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        isAllDay,
        place: "",
        url,
        repeatType,
        repeatInterval,
        repeatWeekDays,
        repeatUseDate,
        repeatEndDate,
        positionIds,
        attendeeMemberIds,
        notificationMinutes,
      } as ScheduleRequest;

      createSchedule.mutate(req, {
        onSuccess: () => {
          // callSchedules();
        },
      });
    } else {
      const req = {
        teamId,
        title,
        description,
        endAt: end.toISOString(),
        place: "",
        url,
        assigneeMemberIds: attendeeMemberIds,
        positionIds,
      } as TodoRequest;
      createTodo.mutate(req, {
        onSuccess: () => {
          // callTodos();
        },
      });
    }
  };
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: globalGreen300,
          tabBarStyle: { backgroundColor: globalGray50, borderTopWidth: 0 },
          headerStyle: {
            backgroundColor: globalGray50,
          },
          headerShadowVisible: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="[teamId]"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <MainIcon color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="home"
          listeners={() => ({
            tabPress: (event) => {
              event.preventDefault();
              handleOpenCalendarModal();
            },
          })}
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <Feather name="plus-circle" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <MyPageIcon color={color} size={24} />,
          }}
        />
      </Tabs>

      {isCalendarModalVisible && (
        <CalendarModal
          selectedDate={selectedDate}
          confirmModal={handleConfirmCalendarModal}
          closeModal={handleCloseCalendarModal}
        />
      )}
    </>
  );
}
