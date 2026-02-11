import { CalendarFormContext } from "@/shared/hooks/useCalendarForm";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { globalGray200, globalSpacingXs } from "..";
import DateTimeForm from "./DateTimeForm";
import PersonForm from "./PersonForm";
import PositionForm from "./PositionForm";

interface CalendarTodoFormProps {}

const CalendarTodoForm = ({}: CalendarTodoFormProps) => {
  const ctx = useContext(CalendarFormContext);
  if (!ctx) throw new Error("CalendarFormContext missing");

  const { readonly, state, dispatch } = ctx;
  const { end, person, position } = state;

  return (
    <View>
      <View style={styles.container}>
        <DateTimeForm
          disabled={readonly}
          label="종료일"
          date={end}
          time={{
            hour: end.getHours(),
            min: end.getMinutes(),
          }}
          onDate={(d) =>
            dispatch({
              type: "SET_END",
              payload: new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                end.getHours(),
                end.getMinutes()
              ),
            })
          }
          onTime={(t) =>
            dispatch({
              type: "SET_END",
              payload: new Date(
                end.getFullYear(),
                end.getMonth(),
                end.getDate(),
                t.hour,
                t.min
              ),
            })
          }
        />
      </View>
      <View style={styles.container}>
        <PersonForm
          disabled={readonly}
          persons={person}
          onPerson={(prev) => (next) => {
            const activeIds = next.filter((n) => n.isActive).map((n) => n.id);
            const n = prev.map((pos) => ({
              ...pos,
              isActive: activeIds.includes(pos.memberId),
            }));
            dispatch({ type: "SET_PERSON", payload: n });
          }}
        />
        <PositionForm
          disabled={readonly}
          positions={position}
          onPosition={(prev) => (next) => {
            const activeIds = next.filter((n) => n.isActive).map((n) => n.id);
            const n = prev.map((pos) => ({
              ...pos,
              isActive: activeIds.includes(pos.positionId),
            }));
            dispatch({ type: "SET_POSITION", payload: n });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: globalSpacingXs,
    borderWidth: 1,
    borderColor: globalGray200,
    overflow: "visible",
    marginTop: 12,
  },
  optionContainer: {
    flexDirection: "row",
    height: 48,
    paddingHorizontal: 8,
    borderBottomColor: globalGray200,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    fontFamily: "Pretendard-Regular",
    fontWeight: "400",
    fontSize: 14,
    flex: 1, // 컨테이너의 남은 가로 공간을 다 사용
    marginLeft: 12,
    letterSpacing: 0,
    paddingVertical: 0,
  },
  row: {
    flexDirection: "row",
  },
});

export default CalendarTodoForm;
