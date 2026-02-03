/**
 * [
  {
    "id": 1,
    "teamId": 1,
    "teamName": "NemoNemo 팀",
    "title": "프로젝트 회의",
    "description": "프로젝트 진행 상황 논의",
    "startAt": "2024-01-15T10:30:00Z",
    "endAt": "2024-01-15T12:30:00Z",
    "isAllDay": false,
    "place": "회의실 A",
    "url": "https://example.com",
    "createdById": 1,
    "createdByName": "홍길동",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "positionIds": [
      1,
      2
    ],
    "representativePositionId": 1,
    "repeatSummary": "2주 간격 · 월, 수",
    "parentScheduleId": 1
  }
]
 */

import { WeekDayType } from "@/shared/ui/molecules/NemoDayButton";

export interface SchedulesResponse {
  id: number;
  teamId: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  place: string;
  url: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  positionIds: number[];
  representativeColorHex: string;
  repeatSummary: string;
  parentScheduleId: number;
  attendeeMemberIds: number[];
}

export interface ScheduleRequest {
  teamId: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  place: string;
  url: string;
  repeatType: string;
  repeatInterval: number | null;
  repeatWeekDays: WeekDayType[];
  repeatUseDate: boolean;
  repeatEndDate: string;
  positionIds: number[];
  attendeeMemberIds: number[];
  alarm: string;
}
