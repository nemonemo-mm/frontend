// AlertModalInput.tsx
import { TextInputProps, View } from "react-native";
import Input from "../atoms/Input";

interface AlertModalInputProps extends TextInputProps {
  isError?: boolean;
}

const AlertModalInput = ({ ...props }: AlertModalInputProps) => {
  return (
    <View style={{ width: "100%" }}>
      <Input variant="modal" {...props} />
    </View>
  );
};

export default AlertModalInput;
