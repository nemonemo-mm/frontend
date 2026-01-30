import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import {
  globalGray0,
  globalGray50,
  globalGray600,
  globalRed50,
  globalRed600,
} from "..";

type InputVariant = "default" | "modal";

interface InputProps extends TextInputProps {
  label?: string;
  isError?: boolean;
  variant?: InputVariant;
  rightIcon?: React.ReactNode;
  onPressRightIcon?: () => void;
}

const Input = ({
  label,
  isError = false,
  variant = "default",
  rightIcon,
  onPressRightIcon,
  ...props
}: InputProps) => {
  const containerStyle =
    variant === "modal" ? styles.containerModal : styles.containerDefault;

  const textStyle =
    variant === "modal" ? styles.inputModal : styles.inputDefault;

  return (
    <View>
      {label && variant === "default" && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View
        style={[
          styles.containerBase,
          containerStyle,
          isError && {
            borderColor: globalRed600,
            backgroundColor: globalRed50,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={globalGray600}
          style={[styles.inputBase, textStyle]}
          {...props}
        />
        {rightIcon && (
          <View style={{ marginRight: 12 }}>
            <Pressable onPress={onPressRightIcon}>{rightIcon}</Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerBase: {
    alignSelf: "stretch",
    minHeight: 48,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    borderWidth: 1,
  },
  containerDefault: {
    backgroundColor: globalGray0,
    borderColor: globalGray0,
  },
  containerModal: {
    backgroundColor: globalGray50,
    borderColor: globalGray50,
  },
  label: {
    fontFamily: "Pretendard-Regular",
    lineHeight: 16,
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 12,
  },
  inputBase: {
    fontFamily: "Pretendard-Regular",
    fontWeight: "400",
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
    letterSpacing: 0,
    paddingVertical: 0,
  },
  inputDefault: {
    lineHeight: 16, // body2
  },
  inputModal: {
    lineHeight: 20, // body2wide
  },
});

export default Input;
