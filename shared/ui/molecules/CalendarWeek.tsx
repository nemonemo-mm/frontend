import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import getWeekSchedules from "@/shared/utils/getWeekSchedules";
import { StyleSheet, View } from "react-native";
import { globalGray400 } from "..";
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
          <NemoDate date={date.date} isCurrentMonth={date.isCurrentMonth} />
        </View>
      ))}
    </View>
  );
};

//일주일 일정
const CalendarWeekSchedules = ({
  dates,
  schedules,
}: CalendarSchedulesProps) => {
  const thisWeekSchedules = getWeekSchedules(dates, schedules);
  const dayWidth = `${100 / 7}%`;

  return (
    <View>
      {thisWeekSchedules.map((schedule) => {
        return (
          <View
            key={`schedule-${schedule.schedule.id}`}
            style={{ flexDirection: "row" }}
          >
            {Array.from({ length: schedule.startIndex }).map((_, index) => (
              <View
                key={`spacer-${schedule.schedule.id}-${index}`}
                style={{ flexBasis: dayWidth }}
              />
            ))}
            <View
              style={[
                {
                  flexBasis: `${(100 / 7) * schedule.span}%`,
                  flexDirection: "row",
                  gap: 4,
                  borderRadius: 2,
                },
                // todo: 배경색 지정
              ]}
            >
              <View
                style={{
                  backgroundColor: globalGray400,
                  width: 3,
                  height: 12,
                  borderRadius: 2,
                }}
              />
              <NemoText level="body3" ellipsizeMode="tail" numberOfLines={1}>
                {schedule.schedule.title}
              </NemoText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

//일주일 날짜 + 일정이 있는 주단위 캘린더
const CalendarWeek = ({ dates, schedules }: CalendarSchedulesProps) => {
  return (
    <View style={style.week}>
      <CalendarWeekDates dates={dates} />
      <CalendarWeekSchedules dates={dates} schedules={schedules} />
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: 355,
  },
  week: {
    minHeight: 91,
  },
  dates: {
    flexBasis: `${100 / 7}%`,
  },
});
export default CalendarWeek;
