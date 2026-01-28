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
  positionId: number;
  positionName: string;
  userImageUrl: string;
}

export interface TemaList {
  teamId: number;
  teamName: string;
  description: string;
}
