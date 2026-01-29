export interface TodoResponse {
  id: number;
  teamId: number;
  teamName: string;
  title: string;
  description: string;
  status: "TODO";
  endAt: string;
  place: string;
  url: string;
  createdById: number;
  createdByName: string;
  assigneeMemberId: number;
  assigneeMemberUserName: string;
  assignees: {
    memberId: number;
    userName: string;
  }[];
  positionIds: number[];
  representativePositionId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoRequest {
  teamId: number;
  title: string;
  description: string;
  endAt: string;
  place: string;
  url: string;
  assigneeMemberIds: number[];
  positionIds: number[];
}
