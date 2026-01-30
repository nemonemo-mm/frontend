import LeaderIcon from "@/assets/icons/leader";
import { exitTeam } from "@/features/team/api/members";
import type { TeamMember } from "@/features/team/types/team.model";
import { globalGray700, globalRed600 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface TeamMembersListProps {
  members?: TeamMember[];
  isLoading: boolean;
  isError: boolean;
  teamId: number | null;
}

type ActiveModal =
  | { type: "profile"; member: TeamMember }
  | { type: "leave" }
  | null;

export default function TeamMembersList({
  members,
  isLoading,
  isError,
  teamId,
}: TeamMembersListProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handleProfileModalOpen = (member: TeamMember) =>
    setActiveModal({ type: "profile", member });
  const handleLeaveModalOpen = () => setActiveModal({ type: "leave" });
  const handleModalClose = () => setActiveModal(null);

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
            <NemoText level="body2">{member.displayName}</NemoText>
            <NemoText level="body2" style={{ color: globalGray700 }}>
              {member.positionName}
            </NemoText>
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
              {`${activeModal.member.displayName} (${activeModal.member.positionName})`}
            </AlertModal.Title>
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
            <AlertModal.Text>팀에서 나갈까요?</AlertModal.Text>
            <AlertModal.Actions
              type="double"
              confirmLabel="나가기"
              onConfirm={handleLeaveTeam}
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
