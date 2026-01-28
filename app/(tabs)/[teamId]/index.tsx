import { teamDetailInfo } from "@/features/team/api/detail";
import { teamListUp } from "@/features/team/api/list";
import { globalGray400, globalGray700, globalGray900 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GroupScreenProps {}

const GroupScreen = ({}: GroupScreenProps) => {
  const { teamId } = useLocalSearchParams();
  const route = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        // teamId 없으면 팀 목록부터
        if (!teamId) {
          const teams = await teamListUp();
          if (!teams || teams.length === 0) return;

          const firstTeam = teams[0];
          await AsyncStorage.setItem("currentTeam", JSON.stringify(firstTeam));

          route.replace(`/(tabs)/${firstTeam.teamId}/calendar`);
          return;
        }

        // teamId 있으면 해당 팀 조회
        const id = Number(teamId);
        if (Number.isNaN(id)) return;

        const teamInfo = await teamDetailInfo(id);
        await AsyncStorage.setItem("currentTeam", JSON.stringify(teamInfo));

        route.replace(`/(tabs)/${id}/calendar`);
      } catch (e) {
        console.error("팀 초기화 실패", e);
      }
    };

    init();
  }, [teamId]);

  const handlePressStart = () => {
    route.navigate("/teams/check");
  };

  const handlePressAlarm = () => {};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.row, styles.layout]}>
        <NemoText level="h3" style={{ color: globalGray400 }}>
          아직 소속된 그룹이 없어요
        </NemoText>
        <View style={{ margin: "auto" }} />
        <Pressable onPress={handlePressAlarm}>
          <Feather
            name="bell"
            size={20}
            color={globalGray700}
            style={{ marginRight: 12 }}
          />
        </Pressable>
      </View>
      <View style={[styles.layout, styles.main]}>
        <View style={[styles.content]}>
          <View>
            <NemoText
              level="h3"
              style={{ color: globalGray900, textAlign: "center" }}
            >
              아직 시작한 프로젝트가 없어요
            </NemoText>
            <NemoText
              level="body3"
              style={{
                color: globalGray900,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Nemonemo에서는 일정과 할 일을 프로젝트 단위로 관리할 수 있어요
            </NemoText>
            <NemoText
              level="body3"
              style={{ color: globalGray900, textAlign: "center" }}
            >
              혼자라면 새로 만들고, 팀이 있다면 참여해서 바로 시작해보세요
            </NemoText>
          </View>
          <CtaButton
            label="프로젝트 시작하기"
            onPress={handlePressStart}
            isActive
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  layout: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  main: {
    flex: 1,
  },
  content: {
    margin: "auto",
    gap: 30,
  },
});

export default GroupScreen;
