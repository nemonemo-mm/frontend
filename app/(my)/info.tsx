import { globalGray700, globalGray900 } from "@/shared/ui";
import ListItem from "@/shared/ui/atoms/ListItem";
import NemoText from "@/shared/ui/atoms/NemoText";
import Ulist from "@/shared/ui/molecules/Ulist";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface InfoSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const Info = () => {
  const router = useRouter();
  const SECTIONS: InfoSection[] = [
    {
      id: "intro",
      title: "",
      content: (
        <NemoText level="body3" style={styles.nemonemo}>
          Nemonemo는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」
          등 관련 법령을 준수합니다.{"\n"}본 개인정보 처리방침은 Nemonemo 서비스
          이용과 관련하여 이용자의 개인정보가 어떻게 수집·이용·보관·파기되는지를
          설명합니다.
        </NemoText>
      ),
    },
    {
      id: "1",
      title: "1. 개인정보의 수집 항목 및 방법",
      content: (
        <>
          <NemoText level="body3" style={styles.nemonemoContainer}>
            1) 수집하는 개인정보 항목
          </NemoText>
          <Ulist style={styles.os}>
            <ListItem>이메일 주소 (로그인 및 계정 식별)</ListItem>
            <ListItem>닉네임 또는 사용자 이름</ListItem>
            <ListItem>서비스 이용 기록 (일정, 투두 등)</ListItem>
            <ListItem>기기 정보 (OS, 앱 버전)</ListItem>
          </Ulist>

          <NemoText level="body3" style={styles.nemonemoContainer}>
            선택 수집 항목
          </NemoText>
          <Ulist style={styles.os}>
            <ListItem>프로필 이미지</ListItem>
            <ListItem>그룹 정보</ListItem>
            <ListItem>일정 참여자 정보</ListItem>
            <ListItem>알림 설정 정보</ListItem>
          </Ulist>
        </>
      ),
    },
    {
      id: "2",
      title: "2. 개인정보의 이용 목적",
      content: (
        <Ulist style={styles.os}>
          <ListItem>회원 식별 및 계정 관리</ListItem>
          <ListItem>일정 및 투두 관리 기능 제공</ListItem>
          <ListItem>그룹 및 협업 기능 제공</ListItem>
          <ListItem>알림 및 일정 리마인드 제공</ListItem>
          <ListItem>서비스 품질 개선</ListItem>
          <ListItem>고객 문의 대응</ListItem>
        </Ulist>
      ),
    },
    {
      id: "3",
      title: "3. 개인정보의 보유 및 이용 기간",
      content: (
        <Ulist style={styles.os}>
          <ListItem>회원 탈퇴 시: 즉시 파기</ListItem>
          <ListItem>법령에 따른 보관 필요 시: 해당 기간 보관</ListItem>
        </Ulist>
      ),
    },
    {
      id: "4",
      title: "4. 개인정보의 제3자 제공",
      content: (
        <Ulist style={styles.os}>
          <ListItem>이용자 사전 동의가 있는 경우</ListItem>
          <ListItem>법령에 의해 요구되는 경우</ListItem>
        </Ulist>
      ),
    },
    {
      id: "5",
      title: "5. 개인정보 처리 위탁",
      content: (
        <Ulist style={styles.os}>
          <ListItem>서버 및 데이터 보관 (클라우드)</ListItem>
          <ListItem>푸시 알림 발송 서비스</ListItem>
        </Ulist>
      ),
    },
    {
      id: "6",
      title: "6. 이용자의 권리와 행사 방법",
      content: (
        <Ulist style={styles.os}>
          <ListItem>개인정보 열람 및 수정 요청</ListItem>
          <ListItem>개인정보 삭제 요청</ListItem>
          <ListItem>회원 탈퇴 요청</ListItem>
        </Ulist>
      ),
    },
    {
      id: "7",
      title: "7. 개인정보의 파기 절차 및 방법",
      content: (
        <NemoText level="body3" style={styles.nemonemoContainer}>
          전자적 파일: 복구 불가능한 방법으로 삭제{"\n"}
          종이 문서: 분쇄 또는 소각
        </NemoText>
      ),
    },
    {
      id: "8",
      title: "8. 개인정보 보호를 위한 조치",
      content: (
        <Ulist style={styles.os}>
          <ListItem>접근 권한 최소화</ListItem>
          <ListItem>데이터 암호화</ListItem>
          <ListItem>보안 업데이트 및 점검</ListItem>
          <ListItem>내부 관리 절차 수립</ListItem>
        </Ulist>
      ),
    },
    {
      id: "9",
      title: "9. 개인정보 보호책임자",
      content: (
        <Ulist style={styles.os}>
          <ListItem>책임자: Nemonemo 운영팀</ListItem>
          <ListItem>이메일: support@nemonemo.app</ListItem>
        </Ulist>
      ),
    },
    {
      id: "10",
      title: "10. 개인정보 처리방침 변경",
      content: (
        <Ulist style={styles.os}>
          <ListItem>시행일자: 2026년 1월 1일</ListItem>
        </Ulist>
      ),
    },
  ];

  const renderItem = ({ item }: { item: InfoSection }) => (
    <View style={styles.group}>
      {item.title ? (
        <NemoText level="body3" style={[styles.text, styles.textTypo]}>
          {item.title}
        </NemoText>
      ) : null}
      {item.content}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, overflow: "scroll" }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="left" size={16} color={globalGray700} />
        </Pressable>
        <NemoText level="h3">개인 정보 처리 방침</NemoText>
      </View>

      <FlatList
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.view}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  main: {
    padding: 20,
  },
  parent: {
    flex: 1,
  },
  textTypo: {
    fontSize: 12,
    textAlign: "left",
    color: "#2b2b2b",
    fontFamily: "Pretendard",
    alignSelf: "stretch",
  },
  view: {
    width: "100%",
    gap: 24,
    padding: 20,
  },
  nemonemo: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    color: globalGray900,
    lineHeight: 18,
    alignSelf: "stretch",
  },
  frameParent: {
    gap: 20,
    alignSelf: "stretch",
  },
  group: {
    gap: 8,
    alignSelf: "stretch",
  },
  text: {
    fontWeight: "600",
    lineHeight: 18,
    fontSize: 12,
  },
  nemonemoContainer: {
    lineHeight: 16,
  },
  os: {
    margin: 0,
    paddingLeft: 16,
  },
  li: {
    marginBottom: 0,
  },
});

export default Info;
