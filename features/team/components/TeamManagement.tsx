import ChevronRightIcon from "@/assets/icons/chevron-right";
import CopyIcon from "@/assets/icons/copy";
import EditIcon from "@/assets/icons/edit";
import GroupIcon from "@/assets/icons/group";
import {
  AddPosition,
  DeletePosition,
  GetPosition,
  UpdatePosition,
} from "@/features/position/api/position";
import { useAddPositionModal } from "@/features/position/hooks/useAddPositionModal";
import { PositionResponse } from "@/features/position/types/position.model";
import { teamDetailInfo } from "@/features/team/api/detail";
import { uploadTeamImage } from "@/features/team/api/image";
import { TeamDetail, TeamList } from "@/features/team/types/team.model";
import { globalGray700, globalRed600 } from "@/shared/ui";
import Chip from "@/shared/ui/atoms/Chip";
import GroupImage from "@/shared/ui/atoms/GroupImage";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import ImageUploadModal from "@/shared/ui/molecules/ImageUploadModal";
import AlertModal from "@/shared/ui/organisms/AlertModal";
import AddPositionModal from "@/shared/ui/templates/AddPositionModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
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

type ActiveModal =
  | { type: "disband" }
  | { type: "positionDeleteConfirm"; position: PositionResponse }
  | { type: "positionDeleteNotAllowed"; position: PositionResponse }
  | null;

export default function TeamManagement({ teamId }: TeamManagementProps) {
  const { isVisible, open, close } = useAddPositionModal();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [editingPosition, setEditingPosition] =
    useState<PositionResponse | null>(null);
  const [isImageSheetOpen, setIsImageSheetOpen] = useState(false);
  const [localTeamImageUri, setLocalTeamImageUri] = useState<string | null>(
    null
  );
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

  const addPositionMutation = useMutation({
    mutationFn: (payload: { positionName: string; colorHex: string }) => {
      return AddPosition(teamId!, {
        positionName: payload.positionName,
        colorHex: payload.colorHex,
      });
    },
    onSuccess: async () => {
      // 목록 갱신
      await queryClient.invalidateQueries({ queryKey: ["positions", teamId] });
      close(); // 모달 닫기 (useAddPositionModal의 close)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) {
        const contentType =
          (e.config?.headers as any)?.get?.("Content-Type") ??
          (e.config?.headers as any)?.["Content-Type"] ??
          (e.config?.headers as any)?.["content-type"];
        console.log("AddPosition 400 debug:", {
          status: e.response?.status,
          data: e.response?.data,
          requestData: e.config?.data,
          url: e.config?.url,
          method: e.config?.method,
          contentType,
        });
        return;
      }
      console.log(e);
      // 여기에 토스트/모달 에러 처리
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: (payload: {
      positionId: number;
      positionName: string;
      colorHex: string;
    }) => {
      return UpdatePosition(teamId!, payload.positionId, {
        positionName: payload.positionName,
        colorHex: payload.colorHex,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["positions", teamId] });
      handleClosePositionModal();
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const deletePositionMutation = useMutation({
    mutationFn: (payload: { positionId: number }) => {
      return DeletePosition(teamId!, payload.positionId);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["positions", teamId] });
      const previousPositions = queryClient.getQueryData<PositionResponse[]>([
        "positions",
        teamId,
      ]);

      queryClient.setQueryData<PositionResponse[]>(
        ["positions", teamId],
        (old) => (old ?? []).filter((p) => p.positionId !== payload.positionId)
      );

      return { previousPositions };
    },
    onError: (e, _payload, context) => {
      if (context?.previousPositions) {
        queryClient.setQueryData<PositionResponse[]>(
          ["positions", teamId],
          context.previousPositions
        );
      }
      setActiveModal(null);
      handleClosePositionModal();
      console.log(e);
    },
    onSuccess: async () => {
      setActiveModal(null);
      handleClosePositionModal();
      await queryClient.invalidateQueries({ queryKey: ["positions", teamId] });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["positions", teamId] });
    },
  });

  const handleAddPosition = (positionName: string, colorHex: string) => {
    addPositionMutation.mutate({ positionName, colorHex });
  };

  const handleOpenCreatePosition = () => {
    setEditingPosition(null);
    open();
  };

  const handleOpenEditPosition = (position: PositionResponse) => {
    setEditingPosition(position);
    open();
  };

  const handleClosePositionModal = () => {
    setEditingPosition(null);
    close();
  };

  const handleHidePositionModal = () => {
    close();
  };

  const handleDeletePosition = () => {
    if (!editingPosition) return;
    if (editingPosition.isDefault) {
      setActiveModal({
        type: "positionDeleteNotAllowed",
        position: editingPosition,
      });
      return;
    }
    setActiveModal({
      type: "positionDeleteConfirm",
      position: editingPosition,
    });
    handleHidePositionModal();
  };

  const handleConfirmDeletePosition = () => {
    if (!editingPosition) return;
    setActiveModal(null);
    handleClosePositionModal();
    deletePositionMutation.mutate({ positionId: editingPosition.positionId });
  };

  const handleEditPosition = (positionName: string, colorHex: string) => {
    if (!editingPosition) return;
    updatePositionMutation.mutate({
      positionId: editingPosition.positionId,
      positionName,
      colorHex,
    });
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
        router.replace(`/${nextTeam.teamId}/calendar`);
      } else {
        // 팀이 하나도 없으면 명시적으로 팀이 없는 상태의 경로로 이동
        router.replace("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLoading = isLoadingTeam || isLoadingPositions;
  const isError = isErrorTeam || isErrorPositions;

  const uploadTeamImageMutation = useMutation({
    mutationFn: (imageUri: string) => uploadTeamImage(teamId!, imageUri),
    onMutate: async (imageUri) => {
      if (!teamId) return;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["teamDetail", teamId] }),
        queryClient.cancelQueries({ queryKey: ["teamList"] }),
      ]);

      const previousTeamDetail = queryClient.getQueryData<TeamDetail>([
        "teamDetail",
        teamId,
      ]);
      const previousTeamList = queryClient.getQueryData<TeamList[]>([
        "teamList",
      ]);

      queryClient.setQueryData<TeamDetail | undefined>(
        ["teamDetail", teamId],
        (previous) =>
          previous
            ? {
                ...previous,
                teamImageUrl: imageUri,
              }
            : previous
      );

      queryClient.setQueryData<TeamList[] | undefined>(
        ["teamList"],
        (previous) =>
          previous?.map((team) =>
            team.teamId === teamId
              ? {
                  ...team,
                  teamImageUrl: imageUri,
                }
              : team
          )
      );

      return { previousTeamDetail, previousTeamList };
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["teamDetail", teamId] }),
        queryClient.invalidateQueries({ queryKey: ["teamList"] }),
      ]);
    },
    onError: (e, _variables, context) => {
      if (!teamId) return;

      if (context?.previousTeamDetail) {
        queryClient.setQueryData(
          ["teamDetail", teamId],
          context.previousTeamDetail
        );
      }

      if (context?.previousTeamList) {
        queryClient.setQueryData(["teamList"], context.previousTeamList);
      }
      console.log(e);
    },
  });

  const handlePickCamera = async () => {
    if (!teamId) return;
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalTeamImageUri(asset.uri);
      uploadTeamImageMutation.mutate(asset.uri);
    }
    setIsImageSheetOpen(false);
  };

  const handlePickLibrary = async () => {
    if (!teamId) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalTeamImageUri(asset.uri);
      uploadTeamImageMutation.mutate(asset.uri);
    }
    setIsImageSheetOpen(false);
  };

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
          {localTeamImageUri || teamDetail.teamImageUrl ? (
            <View style={styles.teamImageContainer}>
              <Pressable onPress={() => setIsImageSheetOpen(true)}>
                <GroupImage
                  size={90}
                  uri={localTeamImageUri ?? teamDetail.teamImageUrl}
                />
                <EditIcon size={24} style={styles.editIcon} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.teamImageContainer}>
              <Pressable onPress={() => setIsImageSheetOpen(true)}>
                <GroupIcon width={90} height={84} />
                <EditIcon size={24} style={styles.editIcon} />
              </Pressable>
            </View>
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
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(team)/edit-Introduction",
                    params: { teamId: String(teamId) },
                  })
                }
              >
                <Input
                  placeholder="팀 소개"
                  label="팀 소개"
                  value={teamDetail.description}
                  editable={false}
                  containerPointerEvents="none"
                  rightIcon={<ChevronRightIcon size={16} />}
                />
              </Pressable>
            </View>
          )}

          {/* 팀 내 포지션 */}
          {positions && (
            <View style={styles.chipsContainer}>
              <NemoText level="body1">포지션 관리하기</NemoText>
              <View style={styles.chipsWrapper}>
                {positions.map((position) => (
                  <Chip
                    key={position.positionId}
                    active={false}
                    onPress={() => handleOpenEditPosition(position)}
                  >
                    <NemoText level="body2">{position.positionName}</NemoText>
                  </Chip>
                ))}
                <Chip active={true} onPress={handleOpenCreatePosition}>
                  <NemoText level="body2">추가하기</NemoText>
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
        {activeModal && activeModal.type === "positionDeleteNotAllowed" && (
          <>
            <AlertModal.Title>삭제할 수 없어요</AlertModal.Title>
            <AlertModal.Text>기본 포지션은 삭제할 수 없습니다.</AlertModal.Text>
            <AlertModal.Actions
              type="single"
              confirmLabel="확인"
              onConfirm={handleDisbandModalClose}
            />
          </>
        )}
        {activeModal && activeModal.type === "positionDeleteConfirm" && (
          <>
            <AlertModal.Title>포지션 삭제</AlertModal.Title>
            <AlertModal.Text>
              {`'${activeModal.position.positionName}' 포지션을 삭제하시겠어요?`}
            </AlertModal.Text>
            <AlertModal.Actions
              type="double"
              confirmLabel="삭제하기"
              onConfirm={handleConfirmDeletePosition}
              cancelLabel="취소하기"
              onCancel={handleDisbandModalClose}
            />
          </>
        )}
      </AlertModal>

      <ImageUploadModal
        visible={isImageSheetOpen}
        onClose={() => setIsImageSheetOpen(false)}
        onPressCamera={handlePickCamera}
        onPressLibrary={handlePickLibrary}
      />

      <AddPositionModal
        visible={isVisible}
        closeModal={handleClosePositionModal}
        mode={editingPosition ? "edit" : "create"}
        initialPositionName={editingPosition?.positionName}
        initialColorHex={editingPosition?.colorHex}
        currentPositionId={editingPosition?.positionId}
        existingPositions={positions ?? []}
        onSubmit={editingPosition ? handleEditPosition : handleAddPosition}
        onDelete={editingPosition ? handleDeletePosition : undefined}
        isSubmitting={
          addPositionMutation.isPending ||
          updatePositionMutation.isPending ||
          deletePositionMutation.isPending
        }
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
  teamImageContainer: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
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
