import ChevronLeftIcon from "@/assets/icons/chevron-left";
import { useTeamMembers } from "@/features/team/hooks/useTeamMembers";
import type { TeamMember } from "@/features/team/types/team.model";
import { globalGray700, globalRed600 } from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import Tabs from "@/shared/ui/molecules/Tabs";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ActiveModal =
  | { type: "profile"; member: TeamMember }
  | { type: "leave" }
  | null;

export default function TeamMembersScreen() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{
    teamId: string;
  }>();

  const parsedTeamId = teamId ? Number(teamId) : null;
  const { data: members, isLoading, isError } = useTeamMembers(parsedTeamId);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handleProfileModalOpen = (member: TeamMember) =>
    setActiveModal({ type: "profile", member });
  const handleLeaveModalOpen = () => setActiveModal({ type: "leave" });

  const handleModalClose = () => setActiveModal(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeftIcon />
        </Pressable>
      </View>

      <View style={styles.tabsContainer}>
        <Tabs
          texts={[{ id: "members", content: "팀원", isActive: true }]}
          handler={() => {}}
        />
      </View>

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
            <ProfileImage size={40} uri={member.userImageUrl} />
            <NemoText level="body2">{member.displayName}</NemoText>
            <NemoText level="body2" style={{ color: globalGray700 }}>
              {" • "}
              {member.positionName}
            </NemoText>
          </Pressable>
        ))}
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
              onConfirm={() => {}}
              cancelLabel="취소하기"
              onCancel={handleModalClose}
            />
          </>
        )}
      </AlertModal>

      <Pressable onPress={handleLeaveModalOpen}>
        <View style={styles.footer}>
          <NemoText level="caption" style={{ color: globalRed600 }}>
            팀 나가기
          </NemoText>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginHorizontal: 20,
  },
  container: {
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 16,
  },
  tabsContainer: {
    gap: 9,
    marginBottom: 8,
  },
  chipsContainer: {
    marginBottom: 20,
  },
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
    margin: "auto",
    marginTop: 488,
    marginBottom: 18,
  },
});
