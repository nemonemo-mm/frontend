import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextProps,
  View,
  ViewProps,
} from "react-native";
import NemoText from "../atoms/NemoText";

// 헤더 옵션
// 인디케이터: 터치 -> 아래 방향 드래그 -> 모달 닫기 -> 서식 삭제?
// 왼쪽버튼: 터치 -> 핸들러
// 오른쪽버튼: 터치 -> 핸들러
// 타이틀: 텍스트

//모달이 총 3가지 타입을 갖지만, 버튼의 아이콘들 종류와 유무, 인디케이터 유무, 타이틀 유무 등을 프랍으로 넣기엔 너무 많은 경우의 수가 생김
// -> 객체로 만들어서 각 요소들을 컴포넌트 사용 시 결정할 수 있도록 해야 할 듯

interface IndicatorProps extends PressableProps {}
interface RightButtonProps extends PressableProps {}
interface LeftButtonProps extends PressableProps {}
interface TitleProps extends TextProps {}
interface HeaderProps extends ViewProps {}

const Indicator = ({ ...props }: IndicatorProps) => {
  return <Pressable style={style.indicator} {...props} />;
};

const RightButton = ({ children, ...props }: RightButtonProps) => {
  return (
    <Pressable style={style.rightButton} {...props}>
      {children}
    </Pressable>
  );
};

const LeftButton = ({ children, ...props }: LeftButtonProps) => {
  return (
    <Pressable style={style.leftButton} {...props}>
      {children}
    </Pressable>
  );
};

const Title = ({ children, ...props }: TitleProps) => {
  return (
    <NemoText level="h2" style={style.title} {...props}>
      {children}
    </NemoText>
  );
};

const Header = ({ children, ...props }: HeaderProps) => {
  return (
    <View style={style.header} {...props}>
      {children}
    </View>
  );
};

const style = StyleSheet.create({
  indicator: {
    height: 5,
    width: 36,
    borderRadius: 3,
    alignItems: "center",
  },
  rightButton: {
    marginLeft: "auto",
  },
  leftButton: {
    marginRight: "auto",
  },
  title: {
    margin: "auto",
  },
  header: {
    flexDirection: "row",
  },
});

const BottomModalHeader = {
  Header,
  Indicator,
  RightButton,
  LeftButton,
  Title,
};

export default BottomModalHeader;
