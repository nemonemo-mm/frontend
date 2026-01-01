import BottomModalContainer from "../molecules/BottomModalContainer";
import BottomModalHeader from "../molecules/BottomModalHeader";

interface BottomModalProps {}

const BottomModal = ({}: BottomModalProps) => {
  return (
    <BottomModalContainer>
      <BottomModalHeader.Indicator />
      <BottomModalHeader.Header>
        <BottomModalHeader.LeftButton></BottomModalHeader.LeftButton>
        <BottomModalHeader.RightButton></BottomModalHeader.RightButton>
        <BottomModalHeader.Title></BottomModalHeader.Title>
      </BottomModalHeader.Header>
    </BottomModalContainer>
  );
};

export default BottomModal;
