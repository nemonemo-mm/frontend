import { StyleSheet, TextInputProps, View } from "react-native";
import { globalRed600 } from "..";
import BaseInput from "../atoms/BaseInput";
import NemoText from "../atoms/NemoText";

interface NemoInputProps extends TextInputProps {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
}

const NemoInput = ({
  label,
  isError = false,
  errorMessage,
  ...props
}: NemoInputProps) => {
  return (
    <View style={styles.wrapper}>
      {label && (
        <NemoText level="body1" style={styles.label}>
          {label}
        </NemoText>
      )}
      <BaseInput isError={isError} {...props} />
      {isError && errorMessage && (
        <NemoText level="caption" style={styles.errorMessage}>
          {errorMessage}
        </NemoText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    marginHorizontal: 20,
  },
  label: {
    marginBottom: 12,
  },
  errorMessage: {
    marginTop: 8,
    color: globalRed600,
  },
});

export default NemoInput;
