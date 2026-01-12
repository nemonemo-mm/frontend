import { StyleSheet, View } from "react-native";
import { globalSpacingXs } from "../index";
import ModalButton from "./ModalButton";

interface SingleButtonActionsProps {
  type: "single";
  confirmLabel: string;
  onConfirm: () => void;
}

interface DoubleButtonActionsProps {
  type: "double";
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

type AlertModalActionsProps =
  | SingleButtonActionsProps
  | DoubleButtonActionsProps;

/**
 * 모달 액션 버튼들
 */
const AlertModalActions = (props: AlertModalActionsProps) => {
  if (props.type === "single") {
    return (
      <View style={styles.container}>
        <View style={styles.buttonWrapper}>
          <ModalButton
            label={props.confirmLabel}
            variant="primary"
            onPress={props.onConfirm}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <ModalButton
          label={props.cancelLabel}
          variant="secondary"
          onPress={props.onCancel}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <ModalButton
          label={props.confirmLabel}
          variant="primary"
          onPress={props.onConfirm}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: globalSpacingXs,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default AlertModalActions;
