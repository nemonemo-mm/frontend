import { GestureResponderEvent, StyleSheet } from "react-native";
import { globalGray200, globalGray900, globalSpacingXs } from "..";
import Button from "../atoms/Button";
import NemoText from "../atoms/NemoText";

interface NemoTextButtonProps {
  onPress: (e: GestureResponderEvent) => void;
  content: string;
}

const NemoTextButton = ({ onPress, content }: NemoTextButtonProps) => {
  return (
    <Button onPress={onPress} containerStyle={style.btn}>
      <NemoText level="body3" style={{ color: globalGray900 }}>
        {content}
      </NemoText>
    </Button>
  );
};
const style = StyleSheet.create({
  btn: {
    borderRadius: globalSpacingXs,
    backgroundColor: globalGray200 + "60",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginLeft: 6,
  },
});

export default NemoTextButton;
