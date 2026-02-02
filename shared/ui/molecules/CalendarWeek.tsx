import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import getWeekSchedules from "@/shared/utils/getWeekSchedules";
import { useContext } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { globalGreen50 } from "..";
import NemoDate from "../atoms/NemoDate";
import NemoText from "../atoms/NemoText";

/* ---------- utils ---------- */
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const packSchedulesIntoLanes = (items: ReturnType<typeof getWeekSchedules>) => {
  const lanes: (typeof items)[] = [];

  items.forEach((item) => {
    let placed = false;

    for (const lane of lanes) {
      const last = lane[lane.length - 1];

      // 겹치지 않으면 같은 레인 사용
      if (item.startIndex > last.startIndex + last.span - 1) {
        lane.push(item);
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push([item]);
    }
  });

  return lanes;
};

/* ---------- constants ---------- */
const WEEK_WIDTH = 355;
const DAY_WIDTH = WEEK_WIDTH / 7;
const DATES_HEIGHT = 18;

const LANE_HEIGHT = 16;
const LANE_GAP = 4;

/* ---------- props ---------- */
interface CalendarSchedulesProps {
  dates: CalendarDate[];
  schedules: CalendarSchedule[];
  onSelectDate?: (date: Date) => void;
}

/* ---------- CalendarWeek ---------- */
const CalendarWeek = ({
  dates,
  schedules,
  onSelectDate,
}: CalendarSchedulesProps) => {
  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error(
      "CalendarContext is undefined. Ensure the provider is set."
    );
  }

  const { selectedDate } = calendarContext;

  const weekSchedules = getWeekSchedules(dates, schedules);
  const lanesCount = Math.min(weekSchedules.length, 4);

  const totalHeight = DATES_HEIGHT + lanesCount * (LANE_HEIGHT + LANE_GAP);

  const handleWeekPress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const index = Math.floor(locationX / DAY_WIDTH);
    onSelectDate?.(dates[index].fullDate);
  };

  return (
    <Pressable
      style={[styles.week, { height: totalHeight, minHeight: 91 }]}
      onPress={handleWeekPress}
    >
      <View pointerEvents="none" style={styles.weekInner}>
        <CalendarWeekDates dates={dates} selectedDate={selectedDate} />
        <CalendarWeekSchedules dates={dates} schedules={schedules} />
      </View>
    </Pressable>
  );
};

export default CalendarWeek;

/* ---------- Dates ---------- */
const CalendarWeekDates = ({
  dates,
  selectedDate,
}: {
  dates: CalendarDate[];
  selectedDate: Date;
}) => {
  return (
    <View style={styles.datesContainer}>
      {dates.map((d) => {
        const isSelected = isSameDay(d.fullDate, selectedDate);

        return (
          <View
            key={d.fullDate.toISOString()}
            style={[styles.dateCell, isSelected && styles.selectedDate]}
          >
            <NemoDate
              style={{ marginBottom: "auto" }}
              date={d.date}
              isCurrentMonth={d.isCurrentMonth}
              disabled={!d.isCurrentMonth}
            />
          </View>
        );
      })}
    </View>
  );
};

/* ---------- Schedules (absolute overlay) ---------- */
const CalendarWeekSchedules = ({
  dates,
  schedules,
}: CalendarSchedulesProps) => {
  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error(
      "CalendarContext is undefined. Ensure the provider is set."
    );
  }

  const weekSchedules = getWeekSchedules(dates, schedules); // maxVisible 쓰면 여기서 자르세요

  const packedLanes = packSchedulesIntoLanes(weekSchedules);
  const visibleLanes = packedLanes.slice(0, 4);

  // ✅ 레인 개수만큼 높이 확보
  const lanesCount = Math.min(weekSchedules.length, 4); // 4줄만 보여줄 거면

  return (
    <View
      style={[
        styles.schedulesOverlay,
        { height: lanesCount * (LANE_HEIGHT + LANE_GAP) },
      ]}
    >
      {visibleLanes.map((lane, rowIndex) =>
        lane.map((s) => (
          <View
            key={`${s.schedule.status}-${s.schedule.id}`}
            style={[
              styles.scheduleWrapper,
              {
                left: s.startIndex * DAY_WIDTH,
                width: s.span * DAY_WIDTH,
                top: rowIndex * (LANE_HEIGHT + LANE_GAP),
                backgroundColor: s.schedule.colorHex + "30",
              },
            ]}
          >
            <ScheduleLane
              startThisWeek={s.startsThisWeek}
              title={s.schedule.title}
              lineColor={s.schedule.colorHex}
            />
          </View>
        ))
      )}
    </View>
  );
};

/* ---------- ScheduleLane ---------- */
const ScheduleLane = ({
  startThisWeek,
  title,
  lineColor,
}: {
  startThisWeek: boolean;
  title: string;
  lineColor: string;
}) => {
  return (
    <View style={styles.lane}>
      {startThisWeek && (
        <View style={[styles.laneLine, { backgroundColor: lineColor }]} />
      )}
      <NemoText level="body3" numberOfLines={1}>
        {title}
      </NemoText>
    </View>
  );
};

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  /* dates */
  datesContainer: {
    flexDirection: "row",
    height: 91,
  },
  dateCell: {
    width: DAY_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  selectedDate: {
    backgroundColor: globalGreen50,
  },

  week: {
    width: WEEK_WIDTH,
  },
  weekInner: {
    position: "relative",
    overflow: "visible",
  },

  schedulesOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: DATES_HEIGHT,
  },

  scheduleWrapper: {
    position: "absolute",
    height: LANE_HEIGHT,
    borderRadius: 6,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  lane: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  laneLine: {
    width: 3,
    height: 12,
    borderRadius: 2,
  },
});
