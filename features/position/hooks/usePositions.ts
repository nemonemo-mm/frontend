import { useQuery } from "@tanstack/react-query";

import { GetPosition } from "../api/position";
import type { PositionResponse } from "../types/position.model";

export interface PositionChip extends PositionResponse {
  isActive: boolean;
}

function toPositionChip(position: PositionResponse): PositionChip {
  return {
    ...position,
    isActive: false,
  };
}

export function usePositions(teamId: number | null) {
  const isEnabled = typeof teamId === "number" && teamId > 0;

  return useQuery({
    queryKey: ["teams", teamId, "positions"],
    queryFn: async () => {
      const data = await GetPosition(teamId as number);
      return data.map(toPositionChip);
    },
    enabled: isEnabled,
  });
}
