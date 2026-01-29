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
import NemoDate from "../atoms/NemoDate";
import NemoText from "../atoms/NemoText";

interface CalendarDatesProps {
  dates: CalendarDate[];
}

interface CalendarSchedulesProps {
  dates: CalendarDate[];
  schedules: CalendarSchedule[];
}
//일주일 날짜
const CalendarWeekDates = ({ dates }: CalendarDatesProps) => {
  return (
    <View style={style.container}>
      {dates.map((date, i) => (
        <View style={style.dates} key={"date" + i}>
          <NemoDate
            date={date.date}
            isCurrentMonth={date.isCurrentMonth}
            disabled={!date.isCurrentMonth}
          />
        </View>
      ))}
    </View>
  );
};

const dayWidth = 100 / 7;
//일주일 일정
const CalendarWeekSchedules = ({
  dates,
  schedules,
}: CalendarSchedulesProps) => {
  const thisWeekSchedules = getWeekSchedules(dates, schedules, 4);
  return (
    <View>
      {thisWeekSchedules.map((schedule, i) => {
        return (
          <View
            key={`${schedule.schedule.status}-${schedule.schedule.id}`}
            style={{ flexDirection: "row" }}
          >
            {schedule.startsThisWeek && (
              <ScheduleSpacer count={schedule.startIndex} />
            )}
            <Pressable
              style={[
                {
                  flexBasis: `${dayWidth * schedule.span}%`,
                  gap: 4,
                  margin: 2,
                },
              ]}
            >
              {i > 2 ? (
                <NemoText level="body3">...</NemoText>
              ) : (
                <ScheduleLane
                  startThisWeek={schedule.startsThisWeek}
                  title={schedule.schedule.title}
                  backgroundColor={schedule.schedule.colorHex + "40"}
                  lineColor={schedule.schedule.colorHex}
                />
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

//일주일 날짜 + 일정이 있는 주단위 캘린더
const CalendarWeek = ({ dates, schedules }: CalendarSchedulesProps) => {
  const value = useContext(CalendarContext);

  const handleWeekPress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const index = Math.floor(locationX / (355 / 7));
    value?.selectDate(dates[index].fullDate);
  };

  return (
    <Pressable style={style.week} onPress={handleWeekPress}>
      <CalendarWeekDates dates={dates} />
      <CalendarWeekSchedules dates={dates} schedules={schedules} />
    </Pressable>
  );
};
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    maxWidth: 355,
  },
  week: {
    minHeight: 91,
    width: "100%",
  },
  dates: {
    flex: 1,
  },
});
export default CalendarWeek;

const ScheduleSpacer = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={{ flexBasis: `${100 / 7}%` }} />
    ))}
  </>
);

const ScheduleLane = ({
  startThisWeek,
  title,
  backgroundColor,
  lineColor,
}: {
  startThisWeek: boolean;
  title: string;
  backgroundColor: string;
  lineColor: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: backgroundColor,
        borderRadius: 2,
        paddingRight: 2,
      }}
    >
      {startThisWeek && (
        <View
          style={{
            backgroundColor: lineColor,
            width: 3,
            height: 12,
            borderRadius: 2,
            margin: 2,
          }}
        />
      )}
      <NemoText level="body3" ellipsizeMode="tail" numberOfLines={1}>
        {title}
      </NemoText>
    </View>
  );
};
