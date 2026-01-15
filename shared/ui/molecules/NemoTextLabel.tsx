import { TextProps } from "react-native-svg";
import { globalGray900 } from "..";
import NemoText from "../atoms/NemoText";

interface NemoTextLabelProps extends TextProps {}

const NemoTextLabel = ({ children }: NemoTextLabelProps) => {
  return (
    <NemoText level="body2" style={{ color: globalGray900 }}>
      {children}
    </NemoText>
  );
};
export default NemoTextLabel;
