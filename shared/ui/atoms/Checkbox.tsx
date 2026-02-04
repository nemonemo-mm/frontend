import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet } from "react-native";

interface CheckBoxProps {
  value: boolean;
  handler: (v: boolean) => void;
}

const Checkbox = ({ value, handler }: CheckBoxProps) => {
  const handlePressCheckBox = () => {
    handler(!value);
  };
  return (
    <Pressable onPress={handlePressCheckBox}>
      {value ? (
        <Ionicons name="checkbox-outline" size={24} color="black" />
      ) : (
        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
      )}
    </Pressable>
  );
};

const style = StyleSheet.create({});

export default Checkbox;
