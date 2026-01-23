import {
  globalBmRadius,
  globalGray0,
  globalGray200,
  globalGray400,
  globalGray700,
  globalGray900,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import Toggle from "@/shared/ui/atoms/Toggle";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TeamAlarmProps {}

const DEFAULT_TEAM_MESSAGE = "아직 생성된 팀이 없습니다";
const CLOSE_MESSAGE = "닫기";

type Team = {
  id: number;
  name: string;
};

const TeamAlarm = ({}: TeamAlarmProps) => {
  const route = useRouter();
  //? 내부 분기 처리가 많아서 라우터를 이용해서 페이지를 분리하는 게 좋을 수도 ?
  const teamLists = [
    { id: 1, name: "NEMONEMO" },
    { id: 12, name: "NEMONEMO2" },
    { id: 123, name: "NEMONEMO2" },
    { id: 124, name: "NEMONEMO2" },
    { id: 1232, name: "NEMONEMO2" },
    { id: 12123, name: "NEMONEMO2" },
    { id: 12124, name: "NEMONEMO2" },
    { id: 1212, name: "NEMONEMO2" },
    { id: 123421, name: "NEMONEMO2" },
    { id: 12125, name: "NEMONEMO2" },
    { id: 112345231452, name: "NEMONEMO2" },
    { id: 112342142, name: "NEMONEMO2" },
    { id: 12343434, name: "NEMONEMO2" },
    { id: 12343436664, name: "NEMONEMO2" },
    { id: 12343436123156664, name: "NEMONEMO2" },
    { id: 1234342324336664, name: "NEMONEMO2" },
    { id: 123666643434, name: "NEMONEMO2" },
  ];
  const [isOpenTeamList, setIsOpenTeamList] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);
  //팀 알림 설정 토글용 설정값입니다. 변수 네이밍은 추후 수정해야함!
  const [isAll, setIsAll] = useState(true);
  const rotation = useRef(new Animated.Value(0)).current;
  const animateIcon = (toValue: number) =>
    Animated.timing(rotation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

  const handleToggleTeamList = () => {
    animateIcon(!isOpenTeamList ? 1 : 0);

    setIsOpenTeamList((prev) => !prev);
  };

  const handlePressTeam = (id: number) => () => {
    setCurrentTeam(teamLists.find((team) => team.id == id));
    setIsOpenTeamList(false);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable onPress={() => route.back()}>
          <AntDesign name="left" size={16} color={globalGray700} />
        </Pressable>
        <NemoText level="h3">팀 알림 설정</NemoText>
      </View>
      <View style={styles.main}>
        <Pressable onPress={handleToggleTeamList}>
          <View style={[styles.linkContainer, styles.link]}>
            {currentTeam ? (
              <NemoText level="body2" style={{ color: globalGray900 }}>
                {currentTeam.name}
              </NemoText>
            ) : (
              <NemoText level="body2" style={{ color: globalGray400 }}>
                알림 설정할 팀 선택하기
              </NemoText>
            )}
            <Animated.View style={animatedStyle}>
              <AntDesign name="down" size={16} color={globalGray700} />
            </Animated.View>
          </View>
        </Pressable>
        <View>
          {currentTeam ? (
            <View>
              <View style={[styles.linkContainer, styles.link]}>
                <NemoText level="body2" style={{ color: globalGray900 }}>
                  팀 알림 허용
                </NemoText>
                <Toggle
                  value={isAll}
                  handler={() => {
                    setIsAll((prev) => !prev);
                  }}
                />
              </View>
              <View style={[styles.linkContainer]}>
                <View style={styles.link}>
                  <NemoText
                    level="body2"
                    style={{ color: isAll ? globalGray900 : globalGray400 }}
                  >
                    스케줄 변경 알림
                  </NemoText>
                  <Toggle value={true} handler={() => {}} />
                </View>
                <View style={styles.border} />
                <View style={styles.link}>
                  <NemoText
                    level="body2"
                    style={{ color: isAll ? globalGray900 : globalGray400 }}
                  >
                    스케줄 마감 알림
                  </NemoText>
                  <NemoText
                    level="body2"
                    style={{ color: isAll ? globalGray900 : globalGray400 }}
                  >
                    끔
                  </NemoText>
                </View>
              </View>
              <View style={[styles.linkContainer]}>
                <View style={styles.link}>
                  <NemoText
                    level="body2"
                    style={{ color: isAll ? globalGray900 : globalGray400 }}
                  >
                    투두 변경 알림
                  </NemoText>
                  <Toggle value={true} handler={() => {}} />
                </View>
                <View style={styles.border} />
                <View style={styles.link}>
                  <NemoText
                    level="body2"
                    style={{ color: isAll ? globalGray900 : globalGray400 }}
                  >
                    투두 마감 알림
                  </NemoText>
                  <NemoText
                    level="body2"
                    style={{ color: isAll ? globalGray900 : globalGray400 }}
                  >
                    끔
                  </NemoText>
                </View>
              </View>
              <View style={[styles.linkContainer, styles.link]}>
                <NemoText
                  level="body2"
                  style={{ color: isAll ? globalGray900 : globalGray400 }}
                >
                  공지 알림
                </NemoText>
                <Toggle value={true} handler={() => {}} />
              </View>
            </View>
          ) : isOpenTeamList ? (
            <Modal
              backdropColor={globalGray0 + "50"}
              style={{
                padding: 20,
                justifyContent: "flex-start",
                backgroundColor: globalGray0,
                borderRadius: globalBmRadius,
              }}
            >
              <FlatList
                data={teamLists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable onPress={handlePressTeam(item.id)}>
                    <View style={[styles.link, styles.list]}>
                      <NemoText level="body2" style={{ color: globalGray900 }}>
                        {item.name}
                      </NemoText>
                    </View>
                    <View style={styles.border} />
                  </Pressable>
                )}
                ListFooterComponent={() => (
                  <Pressable
                    onPress={() => setIsOpenTeamList(false)}
                    style={[styles.link, styles.list]}
                  >
                    <NemoText level="body2">{CLOSE_MESSAGE}</NemoText>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <NemoText level="body2" style={{ color: globalGray400 }}>
                    {DEFAULT_TEAM_MESSAGE}
                  </NemoText>
                }
                style={[
                  styles.linkContainer,
                  { maxHeight: 660, margin: "auto", width: 355 },
                ]}
                contentContainerStyle={[styles.listContainer]}
              />
            </Modal>
          ) : (
            <View style={styles.defaultMessage}>
              <NemoText level="body2" style={{ color: globalGray400 }}>
                팀을 선택하면 해당 팀의 알림을 설정할 수 있어요
              </NemoText>
            </View>
          )}
        </View>
      </View>
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
    position: "relative",
  },
  border: {
    height: 1,
    backgroundColor: globalGray200,
  },
  linkContainer: {
    borderRadius: globalSpacingSm,
    backgroundColor: globalGray0,
    marginBottom: globalSpacingMd,
    overflow: "hidden",
  },
  link: {
    paddingHorizontal: globalSpacingXs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: globalGray0,
    height: 48,
  },
  listContainer: {},

  list: {
    justifyContent: "center",
    width: "100%",
  },
  defaultMessage: {
    margin: "auto",
    marginTop: 222,
  },
});
export default TeamAlarm;
