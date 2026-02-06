import { TextProps } from "react-native-svg";
import { globalGray400, globalGray900 } from "..";
import NemoText from "../atoms/NemoText";

interface NemoTextLabelProps extends TextProps {}

const NemoTextLabel = ({ children, disabled }: NemoTextLabelProps) => {
  return (
    <NemoText
      level="body2"
      style={{ color: disabled ? globalGray400 : globalGray900 }}
    >
      {children}
    </NemoText>
  );
};
export default NemoTextLabel;
