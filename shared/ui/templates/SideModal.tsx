import GroupIcon from "@/assets/icons/group";
import { teamDetailInfo } from "@/features/team/api/detail";
import { TeamList } from "@/features/team/types/team.model";
import { useUser } from "@/features/users/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
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
import GroupImage from "../atoms/GroupImage";
import NemoText from "../atoms/NemoText";
import ProfileImage from "../atoms/ProfileImage";

interface SideModalProps {
  teams: TeamList[];
  closeModal: () => void;
}

const SideModal = ({ teams, closeModal }: SideModalProps) => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const handlePressTeam = (id: number) => async () => {
    const teamInfo = await queryClient.fetchQuery({
      queryKey: ["teamDetail", id],
      queryFn: () => teamDetailInfo(id),
      staleTime: 1000 * 60 * 5,
    });
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
              <ProfileImage size={64} uri={user?.userImageUrl} />
              <NemoText level="body1">{user?.userName}</NemoText>
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
                    {item.teamImageUrl ? (
                      <GroupImage size={56} uri={item.teamImageUrl} />
                    ) : (
                      <GroupIcon />
                    )}
                    <View>
                      <NemoText level="body1" style={{ color: globalGray900 }}>
                        {item.teamName}
                      </NemoText>
                      <NemoText level="body3" style={{ color: globalGray700 }}>
                        {item.description == "MEMBER"
                          ? "전체"
                          : item.description}
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
    maxHeight: 600,
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
