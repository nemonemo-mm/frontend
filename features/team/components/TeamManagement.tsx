import CopyIcon from "@/assets/icons/copy";
import GroupIcon from "@/assets/icons/group";
import { GetPosition } from "@/features/position/api/position";
import { PositionResponse } from "@/features/position/types/position.model";
import { teamDetailInfo } from "@/features/team/api/detail";
import { TeamDetail } from "@/features/team/types/team.model";
import { globalGray700 } from "@/shared/ui";
import Chip from "@/shared/ui/atoms/Chip";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

interface TeamManagementProps {
  teamId: number | null;
}

export default function TeamManagement({ teamId }: TeamManagementProps) {
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
                  active={true}
                  onPress={() => {}}
                >
                  <NemoText level="body2">{position.positionName}</NemoText>
                </Chip>
              ))}
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
          />
        </View>
      </View>
    </ScrollView>
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
});
