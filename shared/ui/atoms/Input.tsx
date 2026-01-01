import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import {
  globalCtaDisabledBackground,
  globalSemanticDanger,
  globalTextUnreadSubtle,
} from "..";

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
            borderColor: globalSemanticDanger,
            backgroundColor: "#fff5f5",
          },
        ]}
      >
        <TextInput
          placeholderTextColor={globalTextUnreadSubtle}
          style={[styles.input]}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 335,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: globalCtaDisabledBackground,
  },
  label: {
    fontFamily: "Pretendard-Regular",
    lineHeight: 16,
    fontWeight: "500",
    fontSize: 14,
    letterSpacing: 0,
    marginBottom: 12,
  },
  input: {
    fontFamily: "Pretendard-Regular",
    fontWeight: "400",
    fontSize: 14,
    width: 280,
    height: 16,
    marginLeft: 12,
    letterSpacing: 0,
  },
  placeholder: {
    color: globalTextUnreadSubtle,
    fontWeight: "400",
  },
});

export default Input;
