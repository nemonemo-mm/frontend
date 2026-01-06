import BottomModalContainer from "../molecules/BottomModalContainer";
import BottomModalHeader from "../molecules/BottomModalHeader";

const BottomModal = {
  Container: BottomModalContainer,
  Header: BottomModalHeader.Header,
  Indicator: BottomModalHeader.Indicator,
  LeftButton: BottomModalHeader.LeftButton,
  RightButton: BottomModalHeader.RightButton,
  Title: BottomModalHeader.Title,
};

// 사용 예시
/** 
const CalendarModal = ({}: BottomModalProps) => {
  return (
    <BottomModal.Container>
      <BottomModal.Indicator />
      <BottomModal.Header>
        <BottomModal.LeftButton>
          <EvilIcons name="close" size={24} color="black" />
        </BottomModal.LeftButton>
        <BottomModal.Title>날짜</BottomModal.Title>
        <BottomModal.RightButton>아이콘2</BottomModal.RightButton>
      </BottomModal.Header>
      나머지 모달 컨텐츠
    </BottomModal.Container>
  );
};
*/
export default BottomModal;
