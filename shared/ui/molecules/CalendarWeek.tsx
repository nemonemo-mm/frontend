import { CalendarDate, CalendarSchedule } from "@/shared/types/Calendar";
import getWeekSchedules from "@/shared/utils/getWeekSchedules";
import { StyleSheet, View } from "react-native";
import { globalGray200, globalGray400 } from "..";
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
//! 이번달에서는 한 칸 뒤로 밀리는데, 이전달 혹은 다음달 날짜에는 잘 표시가 되고 있음...
//일주일 일정
const CalendarWeekSchedules = ({
  dates,
  schedules,
}: CalendarSchedulesProps) => {
  const thisWeekSchedules = getWeekSchedules(dates, schedules, 4);
  const dayWidth = 100 / 7;

  return (
    <View>
      {thisWeekSchedules.map((schedule, i) => {
        return (
          <View
            key={`schedule-${schedule.schedule.id}`}
            style={{ flexDirection: "row" }}
          >
            {schedule.startsThisWeek && (
              <ScheduleSpacer count={schedule.startIndex} />
            )}
            <View
              style={[
                {
                  flexBasis: `${dayWidth * schedule.span}%`,
                  gap: 4,
                  margin: 2,
                },
                // todo: 배경색 지정
              ]}
            >
              {i > 2 ? (
                <NemoText level="body3">...</NemoText>
              ) : (
                <ScheduleLane
                  startThisWeek={schedule.startsThisWeek}
                  title={schedule.schedule.title}
                />
              )}
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
}: {
  startThisWeek: boolean;
  title: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: globalGray200,
        borderRadius: 2,
        paddingRight: 2,
      }}
    >
      {startThisWeek && (
        <View
          style={{
            backgroundColor: globalGray400,
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
