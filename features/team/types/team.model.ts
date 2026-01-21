export interface TeamCreateRequest {
  teamName: string;
  teamIntroduction?: string;
  positions?: Array<{
    positionName: string;
    colorHex: string;
  }>;
  ownerPositionName?: string;
}
