import BellIcon from "@/assets/icons/bell";
import MenuIcon from "@/assets/icons/menu";
import { teamDetailInfo } from "@/features/team/api/detail";
import { useTeamList } from "@/features/team/hooks/useTeamList";
import { globalGray700, globalGray900 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import CtaButton from "@/shared/ui/molecules/CtaButton";
import SideModal from "@/shared/ui/templates/SideModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GroupScreenProps {}

const GroupScreen = ({}: GroupScreenProps) => {
  const { teamId } = useLocalSearchParams();
  const route = useRouter();

  const teamsQuery = useTeamList();
  const { data: teams } = teamsQuery;

  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!teamId) {
          if (!teams || teams.length === 0) return;

          const firstTeam = teams[0];
          await AsyncStorage.setItem("currentTeam", JSON.stringify(firstTeam));

          route.replace(`/${firstTeam.teamId}/calendar`);
          return;
        }

        const id = Number(teamId);
        if (Number.isNaN(id)) return;

        if (id === 0) return;

        const teamInfo = await teamDetailInfo(id);
        await AsyncStorage.setItem("currentTeam", JSON.stringify(teamInfo));

        route.replace(`/${id}/calendar`);
      } catch (e) {
        console.error("팀 초기화 실패", e);
      }
    };

    init();
  }, [teamId, teams, route]);

  const handlePressStart = () => {
    route.navigate("/teams/check");
  };

  const handlePressTeamName = () => {
    setIsOpenSidebar(true);
  };

  const handlePressAlarm = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isOpenSidebar && (
        <SideModal
          teams={teams ?? []}
          closeModal={() => setIsOpenSidebar(false)}
        />
      )}

      <View style={[styles.header, styles.layout]}>
        <Pressable onPress={handlePressTeamName}>
          <MenuIcon />
        </Pressable>

        <View style={{ margin: "auto" }} />

        <Pressable onPress={handlePressAlarm}>
          <BellIcon />
        </Pressable>
      </View>

      <View style={[styles.layout, styles.main]}>
        <Image
          source={require("@/assets/images/calendar.png")}
          style={{ width: 450, height: 130 }}
        />

        <NemoText
          level="h3"
          style={{ color: globalGray900, textAlign: "center" }}
        >
          새 프로젝트를 시작해 보세요
        </NemoText>
        <NemoText
          level="body3"
          style={{
            color: globalGray700,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Nemonemo에서는 일정과 할 일을 프로젝트 단위로 관리할 수 있어요
        </NemoText>
        <NemoText
          level="body3"
          style={{ color: globalGray700, textAlign: "center" }}
        >
          혼자라면 새로 만들고, 팀이 있다면 참여해서 바로 시작해 보세요
        </NemoText>
      </View>

      <View style={styles.cta}>
        <CtaButton label="시작하기" onPress={handlePressStart} isActive />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: 56,
  },
  layout: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  main: {
    flex: 1,
  },
  cta: {
    marginBottom: 20,
  },
});

export default GroupScreen;
