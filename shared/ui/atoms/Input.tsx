import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { globalGray200, globalGray600, globalRed50, globalRed600 } from "..";

interface InputProps extends TextInputProps {
  label?: string;
  isError?: boolean;
}

const Input = ({ label, isError = false, ...props }: InputProps) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          isError && {
            borderColor: globalRed600,
            backgroundColor: globalRed50,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={globalGray600}
          style={[styles.input]}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    minHeight: 48,
    borderRadius: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: globalGray200,
    paddingRight: 12,
  },
  label: {
    fontFamily: "Pretendard-Regular",
    lineHeight: 16,
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 12,
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
  placeholder: {
    color: globalGray600,
    fontWeight: "400",
  },
});

export default Input;
