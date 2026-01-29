/**
 * [
  {
    "id": 1,
    "teamId": 1,
    "name": "MEMBER",
    "colorHex": null,
    "isDefault": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
 */

export interface PositionResponse {
  positionId: number;
  teamId: number;
  positionName: string;
  colorHex: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PositionRequest {
  id: number;
}

export interface PositionAddRequest {
  positionName: string;
  colorHex: string;
}

export interface PositionAddResponse {
  positionId: number;
  positionName: string;
  colorHex: string;
}
