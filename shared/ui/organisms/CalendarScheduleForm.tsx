import { CalendarFormContext } from "@/shared/hooks/useCalendarForm";
import { formatAlarm, formatRepeat } from "@/shared/utils/format";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  globalGray200,
  globalGray400,
  globalGray600,
  globalGray700,
  globalSpacingXs,
} from "..";
import NemoText from "../atoms/NemoText";
import Toggle from "../atoms/Toggle";
import NemoTextLabel from "../molecules/NemoTextLabel";
import AlarmModal from "../templates/AlarmModal";
import RepeatModal from "../templates/RepeatModal";
import DateTimeForm from "./DateTimeForm";
import PersonForm from "./PersonForm";
import PositionForm from "./PositionForm";

interface CalendarScheduleFormProps {}

const CalendarScheduleForm = ({}: CalendarScheduleFormProps) => {
  const ctx = useContext(CalendarFormContext);
  if (!ctx) throw new Error("CalendarFormContext missing");

  const { readonly, state, dispatch } = ctx;
  const {
    isAllDay,
    start,
    end,
    alarm,
    repeat,
    position,
    person,
    description,
    url,
  } = state;

  const alarmLabel = formatAlarm(alarm);
  const repeatLabel = formatRepeat(repeat);

  const [isOpenAlarmModal, setIsOpenAlarmModal] = useState(false);
  const [isOpenRepeatModal, setIsOpenRepeatModal] = useState(false);
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <NemoTextLabel disabled={readonly}>종일</NemoTextLabel>
          <Toggle
            disabled={readonly}
            value={isAllDay}
            handler={(result) => {
              !readonly && dispatch({ type: "SET_ISALLDAY", payload: result });
            }}
          />
        </View>
        <DateTimeForm
          disabled={readonly}
          disableTime={isAllDay}
          label="시작일"
          date={start}
          time={{ hour: start.getHours(), min: start.getMinutes() }}
          onDate={(d: Date) =>
            dispatch({
              type: "SET_START",
              payload: new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                start.getHours(),
                start.getMinutes()
              ),
            })
          }
          onTime={(t) =>
            dispatch({
              type: "SET_START",
              payload: new Date(
                start.getFullYear(),
                start.getMonth(),
                start.getDate(),
                t.hour,
                t.min
              ),
            })
          }
        />
        <View
          style={{ borderBottomWidth: 1, borderBottomColor: globalGray200 }}
        />
        <DateTimeForm
          disabled={readonly}
          disableTime={isAllDay}
          label="종료일"
          date={end}
          time={{ hour: end.getHours(), min: end.getMinutes() }}
          onDate={(d: Date) =>
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
        <View style={styles.optionContainer}>
          <NemoTextLabel disabled={readonly}>알림</NemoTextLabel>
          <Pressable onPress={() => !readonly && setIsOpenAlarmModal(true)}>
            <NemoText level="body3" style={{ color: globalGray700 }}>
              {alarmLabel}
            </NemoText>
          </Pressable>
        </View>
        <View style={[styles.optionContainer, { borderBottomWidth: 0 }]}>
          <NemoTextLabel disabled={readonly}>반복</NemoTextLabel>
          <Pressable onPress={() => !readonly && setIsOpenRepeatModal(true)}>
            <NemoText level="body3" style={{ color: globalGray700 }}>
              {repeatLabel}
            </NemoText>
          </Pressable>
        </View>
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
        <View
          style={{ borderBottomWidth: 1, borderBottomColor: globalGray200 }}
        />
        <View style={[styles.optionContainer, styles.optionInput]}>
          <TextInput
            editable={!readonly}
            placeholderTextColor={readonly ? globalGray400 : globalGray600}
            placeholder="메모를 남겨주세요"
            style={[styles.input]}
            value={description}
            onChangeText={(text: string) =>
              dispatch({ type: "SET_MEMO", payload: text })
            }
          />
        </View>
        <View
          style={[
            styles.optionContainer,
            styles.optionInput,
            { borderBottomWidth: 0 },
          ]}
        >
          <TextInput
            editable={!readonly}
            placeholderTextColor={readonly ? globalGray400 : globalGray600}
            placeholder="관련 링크를 추가해 보세요"
            style={[styles.input]}
            value={url}
            onChangeText={(text: string) =>
              dispatch({ type: "SET_URL", payload: text })
            }
          />
        </View>
      </View>
      {isOpenAlarmModal && (
        <AlarmModal
          initialValue={alarm}
          closeModal={() => setIsOpenAlarmModal(false)}
          confirmModal={(alarmState) =>
            dispatch({ type: "SET_ALARM", payload: alarmState })
          }
        />
      )}
      {isOpenRepeatModal && (
        <RepeatModal
          initialValue={repeat}
          closeModal={() => setIsOpenRepeatModal(false)}
          confirmModal={(repeatState) => {
            dispatch({ type: "SET_REPEAT", payload: repeatState });
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: globalSpacingXs,
    borderWidth: 1,
    borderColor: globalGray200,
    overflow: "hidden",
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
  optionInput: {
    paddingHorizontal: 0,
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
export default CalendarScheduleForm;
