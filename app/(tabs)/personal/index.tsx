import { PositionChip } from "@/features/position/hooks/usePositions";
import { useTeamList } from "@/features/team/hooks/useTeamList";
import { TeamList } from "@/features/team/types/team.model";
import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import Chip from "@/shared/ui/atoms/Chip";
import Chips, { ChipText } from "@/shared/ui/molecules/Chips";
import { TabsText } from "@/shared/ui/molecules/Tabs";
import Calendar from "@/shared/ui/organisms/Calendar";
import { useContext, useState } from "react";
import { View } from "react-native";

interface CalendarScreenProps {}

const convertPositions = (
  positions: PositionChip[] | undefined
): TabsText[] => {
  if (!positions) return [];
  return positions.map((pos, index) => ({
    id: pos.positionId ?? index,
    content: pos.positionName ?? "",
    isActive: true,
  }));
};

const convertTeamList = (teams: TeamList[]): ChipText[] => {
  return teams.map((team) => ({
    id: team.teamId,
    content: team.teamName,
    isActive: false,
  }));
};
const CalendarScreen = ({}: CalendarScreenProps) => {
  // const { createSchedule } = useScheduleMutations();

  // const { createTodo } = useTodoMutations();

  // const positionsQuery = usePositions(teamId);

  // useEffect(() => {
  //   if (positionsQuery.data) {
  //     setCurrentPositions(convertPositions(positionsQuery.data));
  //   }
  // }, [positionsQuery.data]);

  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error("CalendarContext is undefined. Ensure it is provided.");
  }

  const {
    currentYearMonth,
    selectedDate,
    selectDate,
    days,
    schedules,
    callSchedules,
    todos,
    callTodos,
    goPrevMonth,
    goNextMonth,
  } = calendarContext;
  // const [isOpenAddScheduleModal, setIsOpenAddScheduleModal] = useState(false);
  // const [isOpenListModal, setIsOpenListModal] = useState(false);

  const handleCalendarMonth = (direction: -1 | 1) => {
    if (direction == -1) goPrevMonth();
    else goNextMonth();
  };
  // const handleAddSchedule = () => {
  //   setIsOpenAddScheduleModal(true);
  // };
  const { data = [] } = useTeamList();

  const [teamList, setTeamList] = useState<ChipText[]>(convertTeamList(data));

  const [teamId, setTeamId] = useState([0]);
  // const handleConfirmModal = (data: {
  //   id: string;
  //   state: InitialCalendarState;
  // }) => {
  //   const {
  //     title,
  //     description,
  //     url,
  //     start,
  //     end,
  //     person,
  //     position,
  //     repeat,
  //     alarm,
  //     isAllDay,
  //   } = data.state;
  //   const positionIds = position
  //     .filter((pos) => pos.isActive)
  //     .map((pos) => pos.positionId);
  //   const attendeeMemberIds = person
  //     .filter((per) => per.isActive)
  //     .map((per) => per.memberId);
  //   const repeatType = repeat?.period ?? "NONE";
  //   let repeatEndDate = null;
  //   let repeatInterval: number | null = null;
  //   let repeatWeekDays: WeekDayType[] | null = null;
  //   let repeatUseDate: boolean = false;
  //   if (repeat) {
  //     repeatEndDate = repeat.endAt.toISOString();
  //     if (repeat.period == "daily") {
  //       repeatInterval = repeat.interval;
  //     }
  //     if (repeat.period == "weekly") {
  //       repeatInterval = repeat.interval;
  //       repeatWeekDays = repeat.weekdays;
  //     }
  //     if (repeat.period == "monthly" || repeat.period == "yearly") {
  //       repeatUseDate = repeat.useDate;
  //     }
  //   }

  //   const alarmLabel: string = formatAlarm(alarm);

  //   if (data.id == "schedule") {
  //     const req = {
  //       teamId,
  //       title,
  //       description,
  //       startAt: start.toISOString(),
  //       endAt: end.toISOString(),
  //       isAllDay,
  //       place: "",
  //       url,
  //       repeatType,
  //       repeatInterval,
  //       repeatWeekDays,
  //       repeatUseDate,
  //       repeatEndDate,
  //       positionIds,
  //       attendeeMemberIds,
  //       alarm: alarmLabel,
  //     } as ScheduleRequest;

  //     createSchedule.mutate(req, {
  //       onSuccess: () => {
  //         callSchedules();
  //       },
  //     });
  //   } else {
  //     const req = {
  //       teamId,
  //       title,
  //       description,
  //       endAt: end.toISOString(),
  //       place: "",
  //       url,
  //       assigneeMemberIds: attendeeMemberIds,
  //       positionIds,
  //     } as TodoRequest;
  //     createTodo.mutate(req, {
  //       onSuccess: () => {
  //         callTodos();
  //       },
  //     });
  //   }
  // };
  const handleTeamListChips = (next: ChipText[]) => {
    setIsAll((prev) => next.every((n) => n.isActive));
    setTeamList((prev) => next);
    setTeamId(next.filter((n) => n.isActive).map((n) => n.id));
    callSchedules();
    callTodos();
  };

  const handleConfirmListModal = (date: Date) => {
    selectDate(date);
    // setIsOpenAddScheduleModal(true);
  };
  const handleSelectDate = (date: Date) => {
    selectDate(date);
    // setIsOpenListModal(true);
  };
  const [isAll, setIsAll] = useState(true);
  const handlePressIsAll = () => {
    setIsAll(true);
    setTeamList((prev) => prev.map((p) => ({ ...p, isActive: true })));
    callSchedules();
    callTodos();
  };

  const activeTeamList = teamList.filter((p) => p.isActive).map((p) => p.id);
  const filteredSchedules = schedules.filter((s) =>
    activeTeamList.includes(s.teamId)
  );

  const filteredTodos = todos.filter((t) => activeTeamList.includes(t.teamId));

  return (
    <View>
      <View>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <Chip active={isAll} onPress={handlePressIsAll}>
            전체
          </Chip>
          <Chips texts={teamList} handler={handleTeamListChips} />
        </View>
        <Calendar
          year={currentYearMonth.year}
          month={currentYearMonth.month + 1}
          days={days}
          schedules={
            isAll
              ? [...schedules, ...todos]
              : [...filteredSchedules, ...filteredTodos]
          }
          onCalendarMonth={handleCalendarMonth}
          // onAddSchedule={handleAddSchedule}
          onSelectDate={handleSelectDate}
        />
        {/* {isOpenListModal && (
          <ScheduleListModal
            selectedDate={selectedDate}
            closeModal={() => setIsOpenListModal(false)}
            confirmModal={handleConfirmListModal}
          />
        )} */}
        {/* {isOpenAddScheduleModal && (
          <CalendarModal
            selectedDate={selectedDate}
            // confirmModal={handleConfirmModal}
            confirmModal={() => {}}
            closeModal={() => {
              setIsOpenAddScheduleModal(false);
            }}
          />
        )} */}
      </View>
    </View>
  );
};

export default CalendarScreen;
