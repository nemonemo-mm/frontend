import CopyIcon from "@/assets/icons/copy";
import GroupIcon from "@/assets/icons/group";
import { GetPosition } from "@/features/position/api/position";
import { useAddPositionModal } from "@/features/position/hooks/useAddPositionModal";
import { PositionResponse } from "@/features/position/types/position.model";
import { teamDetailInfo } from "@/features/team/api/detail";
import { TeamDetail } from "@/features/team/types/team.model";
import { globalGray700, globalRed600 } from "@/shared/ui";
import Chip from "@/shared/ui/atoms/Chip";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import AddPositionModal from "@/shared/ui/templates/AddPositionModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { teamDisband } from "../api/delete";
import { teamListUp } from "../api/list";

interface TeamManagementProps {
  teamId: number | null;
}

type ActiveModal = { type: "disband" } | null;

export default function TeamManagement({ teamId }: TeamManagementProps) {
  const { isVisible, open, close } = useAddPositionModal();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const queryClient = useQueryClient();

  // 팀 상세 정보 조회
  const {
    data: teamDetail,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
  } = useQuery<TeamDetail>({
    queryKey: ["teamDetail", teamId],
    queryFn: () => teamDetailInfo(teamId!),
    enabled: !!teamId,
  });

  // 팀 포지션 조회
  const {
    data: positions,
    isLoading: isLoadingPositions,
    isError: isErrorPositions,
  } = useQuery<PositionResponse[]>({
    queryKey: ["positions", teamId],
    queryFn: () => GetPosition(teamId!),
    enabled: !!teamId,
  });

  const handleCopyInviteCode = async () => {
    if (teamDetail?.inviteCode) {
      await Clipboard.setStringAsync(teamDetail.inviteCode);
    }
  };

  const handleAddPosition = (positionName: string, colorHex: string) => {
    // TODO: 포지션 추가 API 연동
    console.log("포지션 추가:", positionName, colorHex);
  };

  const handleDisbandModalOpen = () => {
    setActiveModal({ type: "disband" });
  };

  const handleDisbandModalClose = () => {
    setActiveModal(null);
  };

  const handleDisbandTeam = async () => {
    try {
      await teamDisband(teamId!);
      handleDisbandModalClose();

      // 1. 서버에서 최신 팀 목록 다시 가져오기
      const updatedTeams = await queryClient.fetchQuery({
        queryKey: ["teamList"],
        queryFn: teamListUp,
      });

      // 2. 남은 팀이 있는지 확인하여 이동
      if (updatedTeams && updatedTeams.length > 0) {
        // 해체한 팀이 아닌 다른 팀(첫 번째 팀)으로 이동
        const nextTeam =
          updatedTeams.find((t) => t.teamId !== teamId) || updatedTeams[0];
        router.replace(`/(tabs)/${nextTeam.teamId}/calendar`);
      } else {
        // 팀이 하나도 없으면 명시적으로 팀이 없는 상태의 경로로 이동
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLoading = isLoadingTeam || isLoadingPositions;
  const isError = isErrorTeam || isErrorPositions;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !teamDetail) {
    return (
      <View style={styles.centerContainer}>
        <NemoText level="body2" style={{ color: globalGray700 }}>
          팀 정보를 불러오는데 실패했습니다.
        </NemoText>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 상단 팀 이미지 */}
        <View style={styles.topSection}>
          {teamDetail.teamImageUrl ? (
            <ProfileImage size={90} uri={teamDetail.teamImageUrl} />
          ) : (
            <GroupIcon width={90} height={84} />
          )}
        </View>

        {/* 팀 정보 폼 */}
        <View style={styles.formContainer}>
          <View>
            <Input
              placeholder="팀 이름"
              label="팀 이름"
              value={teamDetail.teamName}
              editable={false}
            />
          </View>

          {teamDetail.description && (
            <View>
              <Input
                placeholder="팀 소개"
                label="팀 소개"
                value={teamDetail.description}
                editable={false}
              />
            </View>
          )}

          {/* 팀 내 포지션 */}
          {positions && positions.length > 0 && (
            <View style={styles.chipsContainer}>
              <NemoText level="body1">팀 내 포지션</NemoText>
              <View style={styles.chipsWrapper}>
                {positions.map((position) => (
                  <Chip
                    key={position.positionId}
                    active={false}
                    onPress={() => {}}
                  >
                    <NemoText level="body2">{position.positionName}</NemoText>
                  </Chip>
                ))}
                <Chip active={true} onPress={open}>
                  <NemoText level="body2">포지션 추가</NemoText>
                </Chip>
              </View>
            </View>
          )}

          <View style={styles.inviteCodeContainer}>
            <Input
              placeholder="팀 초대 코드"
              label="팀 초대 코드"
              value={teamDetail.inviteCode}
              editable={false}
              rightIcon={<CopyIcon />}
              onPressRightIcon={handleCopyInviteCode}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={handleDisbandModalOpen}>
          <NemoText level="caption" style={{ color: globalRed600 }}>
            팀 해체하기
          </NemoText>
        </Pressable>
      </View>

      <AlertModal
        visible={activeModal !== null}
        onClose={handleDisbandModalClose}
      >
        {activeModal && activeModal.type === "disband" && (
          <>
            <AlertModal.Title>팀 해체하기</AlertModal.Title>
            <AlertModal.Text>
              {`'${teamDetail.teamName}' 팀을 해체할까요?`}
            </AlertModal.Text>
            <AlertModal.Actions
              type="double"
              confirmLabel="해체하기"
              onConfirm={handleDisbandTeam}
              cancelLabel="취소하기"
              onCancel={handleDisbandModalClose}
            />
          </>
        )}
      </AlertModal>

      <AddPositionModal
        visible={isVisible}
        closeModal={close}
        onAddPosition={handleAddPosition}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
  },
  formContainer: {
    gap: 12,
    marginTop: 30,
  },
  chipsContainer: {
    gap: 12,
    height: 96,
  },
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  inviteCodeContainer: {
    marginTop: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
});
