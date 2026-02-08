export interface TeamCreateRequest {
  teamName: string;
  description?: string;
  positions: Array<{ positionName: string; colorHex: string }>;
  ownerPositionName: string;
}

export interface Position {
  positionId: number;
  positionName: string;
  colorHex: string;
}

export interface TeamInfoResponse {
  teamId: number;
  teamName: string;
  ownerName: string;
  description: string;
  teamImageUrl: string;
  positions: Position[];
}

export interface TeamMember {
  memberId: number;
  userId: number;
  displayName: string;
  userName?: string; //!api 수정 전 임시 추가
  positionId: number;
  positionName: string;
  userImageUrl: string;
  isOwner: boolean;
}

export interface OwnerInfo {
  userId: number;
  ownerName: string;
  ownerImageUrl: string;
}

export interface TeamMembersResponse {
  teamName: string;
  ownerInfo: OwnerInfo;
  members: TeamMember[];
}

export interface TemaList {
  teamId: number;
  teamName: string;
  description: string;
}

export interface TeamDetail {
  teamId: number;
  teamName: string;
  inviteCode: string;
  ownerId: number;
  ownerName: string;
  isOwner: boolean;
  description: string;
  teamImageUrl: string;
  createdAt: string;
  updatedAt: string;
}
