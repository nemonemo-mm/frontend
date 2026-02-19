import { CalendarContext } from "@/shared/hooks/useCalendarAPI";
import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import getWeekSchedules from "@/shared/utils/getWeekSchedules";
import { useContext, useRef } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { globalGray150 } from "..";
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

const LANE_HEIGHT = 16;
const LANE_GAP = 4;
const DATES_HEIGHT = 18;
const DOUBLE_TAP_DELAY_MS = 280;

/* ---------- props ---------- */
interface CalendarSchedulesProps {
  dates: CalendarDate[];
  schedules: CalendarSchedule[];
  onSelectDate?: (date: Date) => void;
  maxLanes?: number;
  onLongSelectDate?: () => void;
}

/* ---------- CalendarWeek ---------- */
const CalendarWeek = ({
  maxLanes = 4,
  dates,
  schedules,
  onSelectDate,
  onLongSelectDate,
}: CalendarSchedulesProps) => {
  const calendarContext = useContext(CalendarContext);
  const { width, height } = useWindowDimensions();
  const WEEK_WIDTH = width - 40;
  const DAY_WIDTH = WEEK_WIDTH / 7;

  if (!calendarContext) {
    throw new Error(
      "CalendarContext is undefined. Ensure the provider is set."
    );
  }

  const { selectedDate } = calendarContext;
  const MAX_LANES = height > 1200 ? maxLanes + 2 : maxLanes;
  const totalHeight = DATES_HEIGHT + MAX_LANES * (LANE_HEIGHT + LANE_GAP);
  const lastTapRef = useRef<{ time: number; index: number } | null>(null);

  const handleWeekPress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const index = Math.min(6, Math.max(0, Math.floor(locationX / DAY_WIDTH)));
    const tappedDate = dates[index].fullDate;
    const now = Date.now();
    const lastTap = lastTapRef.current;

    onSelectDate?.(tappedDate);

    if (isSameDay(tappedDate, selectedDate)) {
      onLongSelectDate?.();
      lastTapRef.current = null;
      return;
    }

    if (
      lastTap &&
      now - lastTap.time <= DOUBLE_TAP_DELAY_MS &&
      lastTap.index === index
    ) {
      onLongSelectDate?.();
      lastTapRef.current = null;
      return;
    }

    lastTapRef.current = { time: now, index };
  };

  return (
    <Pressable
      style={{ height: totalHeight, width: WEEK_WIDTH }}
      onPress={handleWeekPress}
    >
      <View pointerEvents="none" style={styles.weekInner}>
        <CalendarWeekDates
          dates={dates}
          selectedDate={selectedDate}
          maxLanes={maxLanes}
        />
        <CalendarWeekSchedules
          dates={dates}
          schedules={schedules}
          maxLanes={maxLanes}
        />
      </View>
    </Pressable>
  );
};

export default CalendarWeek;

/* ---------- Dates ---------- */
const CalendarWeekDates = ({
  maxLanes = 4,
  dates,
  selectedDate,
}: {
  maxLanes?: number;
  dates: CalendarDate[];
  selectedDate: Date;
}) => {
  const { width, height } = useWindowDimensions();
  const WEEK_WIDTH = width - 40;
  const DAY_WIDTH = WEEK_WIDTH / 7;
  const MAX_LANES = height > 1200 ? maxLanes + 2 : maxLanes; // Replace 600 with the appropriate threshold value

  const totalHeight = DATES_HEIGHT + MAX_LANES * (LANE_HEIGHT + LANE_GAP);
  return (
    <View style={[styles.datesContainer, { height: totalHeight }]}>
      {dates.map((d) => {
        const isSelected = isSameDay(d.fullDate, selectedDate);

        return (
          <View
            key={d.fullDate.toISOString()}
            style={[
              styles.dateCell,
              isSelected && styles.selectedDate,
              {
                width: DAY_WIDTH,
                height: totalHeight,
              },
            ]}
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
  maxLanes = 4,
}: CalendarSchedulesProps) => {
  const calendarContext = useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error(
      "CalendarContext is undefined. Ensure the provider is set."
    );
  }
  const { width, height } = useWindowDimensions();
  const MAX_LANES = height > 1200 ? maxLanes + 2 : maxLanes; // Replace 600 with the appropriate threshold value

  const weekSchedules = getWeekSchedules(dates, schedules); // maxVisible 쓰면 여기서 자르세요

  const packedLanes = packSchedulesIntoLanes(weekSchedules);
  const visibleLanes = packedLanes.slice(0, MAX_LANES);
  const hasOverflow = packedLanes.length >= MAX_LANES;
  const WEEK_WIDTH = width - 40;
  const DAY_WIDTH = WEEK_WIDTH / 7;
  return (
    <View
      style={[
        styles.schedulesOverlay,
        { height: MAX_LANES * (LANE_HEIGHT + LANE_GAP), top: 18 },
      ]}
    >
      {visibleLanes.map((lane, rowIndex) => {
        const isLastLane = rowIndex === MAX_LANES - 1;

        return lane.map((s, idx) => {
          // 마지막 레인 + 초과 일정이 있으면 ...만 표시
          if (isLastLane && hasOverflow && idx === 0) {
            return (
              <View
                key={`${s.schedule.status}-${s.schedule.id}`}
                style={[
                  styles.scheduleWrapper,
                  {
                    left: s.startIndex * DAY_WIDTH,
                    width: s.span * DAY_WIDTH,
                    top: rowIndex * (LANE_HEIGHT + LANE_GAP),
                    backgroundColor: "transparent",
                  },
                ]}
              >
                <NemoText level="body3">...</NemoText>
              </View>
            );
          }

          // 초과 일정은 렌더링 안 함
          if (isLastLane && hasOverflow) return null;

          return (
            <View
              key={`${s.schedule.status}-${s.schedule.id}`}
              style={[
                styles.scheduleWrapper,
                {
                  left: s.startIndex * DAY_WIDTH + 4,
                  width: s.span * DAY_WIDTH - 8,
                  top: rowIndex * (LANE_HEIGHT + LANE_GAP),
                  backgroundColor:
                    s.schedule.status == "SCHEDULE"
                      ? s.schedule.colorHex
                        ? s.schedule.colorHex + "66"
                        : "#BDBDBD66"
                      : "transparent",
                },
              ]}
            >
              <ScheduleLane
                startThisWeek={s.startsThisWeek}
                title={s.schedule.title}
                lineColor={s.schedule.colorHex ?? "#BDBDBD"}
              />
            </View>
          );
        });
      })}
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
  },
  dateCell: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  selectedDate: {
    backgroundColor: globalGray150,
  },

  weekInner: {
    position: "relative",
    overflow: "visible",
  },

  schedulesOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },

  scheduleWrapper: {
    position: "absolute",
    height: LANE_HEIGHT,
    borderRadius: 2,
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
