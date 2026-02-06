import { AntDesign } from "@expo/vector-icons";
import { useReducer } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { globalGray700, globalGreen700 } from "..";
import Checkbox from "../atoms/Checkbox";
import NemoText from "../atoms/NemoText";
import BottomModal from "../organisms/BottomModal";

interface AlarmModalProps {
  initialValue: AlarmState | null;
  closeModal: () => void;
  confirmModal: (data: typeof initialState) => void;
}

export type AlarmState = {
  10: boolean;
  30: boolean;
  60: boolean;
};
const initialState: AlarmState = {
  10: false,
  30: false,
  60: false,
};

type Action = { type: "SELECT"; key: keyof AlarmState } | { type: "RESET" };

const reducer = (state: AlarmState, action: Action): AlarmState => {
  switch (action.type) {
    case "SELECT":
      return {
        ...state,
        [action.key as number]: !state[action.key],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const AlarmModal = ({
  initialValue,
  closeModal,
  confirmModal,
}: AlarmModalProps) => {
  const [state, dispatch] = useReducer(reducer, initialValue ?? initialState);
  const ten = state[10];
  const thirty = state[30];
  const sixty = state[60];

  const off = !ten && !thirty && !sixty;

  const handleAlarmState = (id: keyof AlarmState | "off") => {
    if (id == "off") {
      dispatch({ type: "RESET" });
      return;
    }
    dispatch({ type: "SELECT", key: id });
  };

  const handleConfirmModal = () => {
    confirmModal(state);
    closeModal();
  };
  return (
    <Modal backdropColor={globalGray700 + "20"} animationType="slide">
      <BottomModal.Container>
        <BottomModal.Header>
          <BottomModal.LeftButton onPress={closeModal}>
            <AntDesign name="close" size={20} color={globalGray700} />
          </BottomModal.LeftButton>
          <BottomModal.Title>알림</BottomModal.Title>
          <BottomModal.RightButton onPress={handleConfirmModal}>
            <AntDesign name="check" size={20} color={globalGreen700} />
          </BottomModal.RightButton>
        </BottomModal.Header>
        <View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">10분</NemoText>
            <Checkbox value={ten} handler={() => handleAlarmState(10)} />
          </View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">30분</NemoText>
            <Checkbox value={thirty} handler={() => handleAlarmState(30)} />
          </View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">1시간</NemoText>
            <Checkbox value={sixty} handler={() => handleAlarmState(60)} />
          </View>
          <View style={style.checkboxContainer}>
            <NemoText level="body2">끔</NemoText>
            <Checkbox value={off} handler={() => handleAlarmState("off")} />
          </View>
        </View>
      </BottomModal.Container>
    </Modal>
  );
};
const style = StyleSheet.create({
  checkboxContainer: {
    height: 48,
    flexDirection: "row",

    paddingHorizontal: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default AlarmModal;
