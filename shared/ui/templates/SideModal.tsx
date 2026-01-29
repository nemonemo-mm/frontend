import GroupIcon from "@/assets/icons/group";
import { teamDetailInfo } from "@/features/team/api/detail";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  FlatList,
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  globalGray0,
  globalGray200,
  globalGray700,
  globalGray900,
  globalSpacingLg,
  globalSpacingXs,
} from "..";
import NemoText from "../atoms/NemoText";
import ProfileImage from "../atoms/ProfileImage";
export type Teams = {
  teamId: number;
  teamName: string;
  description: string;
}[];
interface SideModalProps {
  teams: Teams;
  closeModal: () => void;
}

const SideModal = ({ teams, closeModal }: SideModalProps) => {
  const route = useRouter();

  const handlePressTeam = (id: number) => async () => {
    const teamInfo = await teamDetailInfo(id);
    await AsyncStorage.setItem("currentTeam", JSON.stringify(teamInfo));
    closeModal();
    route.push(`/(tabs)/${id}/calendar`);
  };
  const insets = useSafeAreaInsets();
  const handleCloseModal = (e: GestureResponderEvent) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <Modal backdropColor={globalGray700 + "40"}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View
          style={[styles.sideContainer, { paddingVertical: insets.top + 56 }]}
        >
          <View>
            <View style={{ margin: "auto", gap: 12, marginBottom: 30 }}>
              <ProfileImage size={64} />
              <NemoText level="body1">userName</NemoText>
            </View>
            <View style={styles.border} />
            <View style={styles.groupContainer}>
              <NemoText level="h2">소속된 그룹</NemoText>
              <FlatList
                data={teams}
                keyExtractor={(item) => String(item.teamId)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={handlePressTeam(item.teamId)}
                    style={styles.group}
                  >
                    <GroupIcon />
                    <View>
                      <NemoText level="body1" style={{ color: globalGray900 }}>
                        {item.teamName}
                      </NemoText>
                      <NemoText level="body3" style={{ color: globalGray700 }}>
                        {item.description}
                      </NemoText>
                    </View>
                  </Pressable>
                )}
                ListFooterComponent={() => (
                  <Pressable
                    style={styles.group}
                    onPress={() => route.push("/teams/check")}
                  >
                    <View style={styles.selectBox}>
                      <Ionicons name="add" size={20} color="black" />
                    </View>
                    <NemoText level="h3" style={{ color: globalGray900 }}>
                      그룹 생성하기
                    </NemoText>
                  </Pressable>
                )}
              />
            </View>
            <View style={styles.border} />
          </View>
        </View>
        <Pressable
          style={styles.backgroundContainer}
          onPress={handleCloseModal}
        ></Pressable>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    flexShrink: 1,
  },
  sideContainer: {
    backgroundColor: globalGray0,
    justifyContent: "flex-start",
    flexBasis: 260,
    flex: 1,
  },
  groupContainer: {
    paddingHorizontal: globalSpacingLg,
    gap: 8,
  },
  border: {
    height: 1,
    marginVertical: 16,
    backgroundColor: globalGray200,
  },
  group: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  selectBox: {
    width: 56,
    height: 52,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: globalSpacingXs,
    borderStyle: "dashed",
  },
});
export default SideModal;
