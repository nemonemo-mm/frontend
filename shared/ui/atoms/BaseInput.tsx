import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { globalGray0, globalGray600, globalRed50, globalRed600 } from "..";

interface BaseInputProps extends TextInputProps {
  isError?: boolean;
}

const BaseInput = ({ isError = false, ...props }: BaseInputProps) => {
  return (
    <View style={[styles.container, isError && styles.containerError]}>
      <TextInput
        placeholderTextColor={globalGray600}
        style={styles.input}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: globalGray0,
    borderColor: globalGray0,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  containerError: {
    borderColor: globalRed600,
    backgroundColor: globalRed50,
  },
  input: {
    fontFamily: "Pretendard-Regular",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 16,
    flex: 1,
    paddingVertical: 0,
    letterSpacing: 0,
  },
});

export default BaseInput;
