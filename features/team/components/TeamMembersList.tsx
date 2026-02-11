import LeaderIcon from "@/assets/icons/leader";
import RemoveMemberIcon from "@/assets/icons/remove-member";
import { usePositions } from "@/features/position/hooks/usePositions";
import { exitTeam, removeMember } from "@/features/team/api/members";
import type {
  TeamMember,
  TeamMembersResponse,
} from "@/features/team/types/team.model";
import { globalGray700, globalRed600 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import PositionListModal from "@/shared/ui/templates/PositionListModal";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  useTeamMembers,
  useTeamMembersMutations,
} from "../hooks/useTeamMembers";

interface TeamMembersListProps {
  members?: TeamMember[];
  isLoading: boolean;
  isError: boolean;
  teamId: number | null;
  isOwner?: boolean;
}

type ActiveModal =
  | { type: "profile"; member: TeamMember }
  | { type: "leave" }
  | { type: "remove"; member: TeamMember }
  | null;

export default function TeamMembersList({
  members,
  isLoading,
  isError,
  teamId,
  isOwner,
}: TeamMembersListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const { data: teamData } = useTeamMembers(teamId);

  const { mutate: removeMemberMutate } = useMutation({
    mutationFn: (memberId: number) => removeMember(teamId!, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({
        queryKey: ["teams", teamId, "members"],
      });

      const previousMembers = queryClient.getQueryData<TeamMembersResponse>([
        "teams",
        teamId,
        "members",
      ]);

      if (previousMembers) {
        queryClient.setQueryData<TeamMembersResponse>(
          ["teams", teamId, "members"],
          {
            ...previousMembers,
            members: previousMembers.members.filter(
              (m) => m.memberId !== memberId,
            ),
          },
        );
      }

      return { previousMembers };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(
          ["teams", teamId, "members"],
          context.previousMembers,
        );
      }
      Alert.alert("오류", "멤버 삭제 중 문제가 발생했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams", teamId, "members"],
      });
      handleModalClose();
    },
  });

  const handleProfileModalOpen = (member: TeamMember) =>
    setActiveModal({ type: "profile", member });
  const handleLeaveModalOpen = () => setActiveModal({ type: "leave" });
  const handleRemoveModalOpen = (member: TeamMember) =>
    setActiveModal({ type: "remove", member });
  const handleModalClose = () => {
    setActiveModal(null);
    animateIcon(0);
    setIsOpenPositionList(false);
  };

  const handleLeaveTeam = async () => {
    if (!teamId) return;
    try {
      await exitTeam(teamId);
      handleModalClose();

      Alert.alert("알림", "팀에서 나갔습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "팀 나가기에 실패했습니다.";

      Alert.alert("알림", message);
      handleModalClose();
    }
  };

  const handleRemoveMember = () => {
    if (!teamId || activeModal?.type !== "remove") return;
    removeMemberMutate(activeModal.member.memberId);
  };

  const positionQuery = usePositions(teamId);
  const positionList = positionQuery.data;
  const [isOpenPositionList, setIsOpenPositionList] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;

  const animateIcon = (toValue: number) =>
    Animated.timing(rotation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

  const handleTogglePositionList = () => {
    animateIcon(!isOpenPositionList ? 1 : 0);

    setIsOpenPositionList((prev) => !prev);
  };

  const { changePosition } = useTeamMembersMutations();

  const handlePressPosition = (memberId: number) => (id: number) => () => {
    animateIcon(!isOpenPositionList ? 1 : 0);
    if (teamId && memberId) {
      changePosition.mutate(
        { teamId, positionId: id, memberId },
        {
          onSuccess: (data) => {
            handleProfileModalOpen({
              ...data,
              userName: data.userName || "",
            });
          },
        },
      );
    }
    setIsOpenPositionList(false);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <>
      <View style={styles.membersContainer}>
        {isLoading && <ActivityIndicator style={styles.loader} />}

        {isError && (
          <NemoText
            level="body2"
            style={{ textAlign: "center", marginTop: 20, color: globalRed600 }}
          >
            팀원 목록을 불러오는데 실패했습니다.
          </NemoText>
        )}

        {members?.map((member) => (
          <Pressable
            key={member.memberId}
            style={styles.memberItem}
            onPress={() => handleProfileModalOpen(member)}
          >
            <View>
              <ProfileImage size={40} uri={member.userImageUrl} />
              {member.isOwner && (
                <View style={styles.leaderIconContainer}>
                  <LeaderIcon size={12} />
                </View>
              )}
            </View>
            <NemoText level="body2">{member.userName}</NemoText>
            <NemoText level="body2" style={{ color: globalGray700 }}>
              {member.positionName}
            </NemoText>

            {isOwner && !member.isOwner && (
              <View style={{ position: "absolute", right: 8 }}>
                <Pressable onPress={() => handleRemoveModalOpen(member)}>
                  <RemoveMemberIcon size={24} />
                </Pressable>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleLeaveModalOpen}>
          <NemoText level="caption" style={{ color: globalRed600 }}>
            팀 나가기
          </NemoText>
        </Pressable>
      </View>

      <AlertModal visible={activeModal !== null} onClose={handleModalClose}>
        {activeModal && activeModal.type === "profile" && (
          <>
            <AlertModal.ProfileImage
              size={56}
              uri={activeModal.member.userImageUrl}
            />
            <AlertModal.Title>
              {`${activeModal.member.userName}`}
            </AlertModal.Title>
            {isOwner ? (
              <Pressable
                onPress={handleTogglePositionList}
                style={{ flexDirection: "row" }}
              >
                <AlertModal.Text>
                  {`${activeModal.member.positionName}`}
                </AlertModal.Text>

                <Animated.View style={animatedStyle}>
                  <AntDesign name="down" size={16} color={globalGray700} />
                </Animated.View>
              </Pressable>
            ) : (
              <AlertModal.Text>
                {`${activeModal.member.positionName}`}
              </AlertModal.Text>
            )}

            {isOwner && isOpenPositionList && (
              <PositionListModal
                positionList={positionList ?? []}
                onPressPosition={handlePressPosition(
                  activeModal.member.memberId,
                )}
                onPointerDown={handleTogglePositionList}
              />
            )}

            <AlertModal.Actions
              type="single"
              confirmLabel="닫기"
              onConfirm={handleModalClose}
            />
          </>
        )}

        {activeModal && activeModal.type === "leave" && (
          <>
            <AlertModal.Title>팀 나가기</AlertModal.Title>
            <AlertModal.Text>
              {`${teamData?.teamName}에서 나갈까요?`}
            </AlertModal.Text>
            <AlertModal.Actions
              type="double"
              confirmLabel="나가기"
              onConfirm={handleLeaveTeam}
              cancelLabel="취소하기"
              onCancel={handleModalClose}
            />
          </>
        )}

        {activeModal && activeModal.type === "remove" && (
          <>
            <AlertModal.Title>멤버를 내보내기</AlertModal.Title>
            <AlertModal.Text>
              {`${activeModal.member.userName}님을 팀에서 내보낼까요?`}
            </AlertModal.Text>
            <AlertModal.Actions
              type="double"
              confirmLabel="내보내기"
              onConfirm={handleRemoveMember}
              cancelLabel="취소하기"
              onCancel={handleModalClose}
            />
          </>
        )}
      </AlertModal>
    </>
  );
}

const styles = StyleSheet.create({
  membersContainer: {
    flex: 1,
    gap: 8,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 13,
    gap: 8,
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  leaderIconContainer: {
    position: "absolute",
    bottom: -2,
    right: -2,
  },
});
