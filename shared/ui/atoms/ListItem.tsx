import { StyleProp, TextStyle, View } from "react-native";
import NemoText from "./NemoText";

type ListItemProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  bulletChar?: string;
};

const ListItem = ({ children, style, bulletChar = "•" }: ListItemProps) => {
  return (
    <View>
      <NemoText level="body3" style={style}>
        {bulletChar} {children}
      </NemoText>
    </View>
  );
};
export default ListItem;
