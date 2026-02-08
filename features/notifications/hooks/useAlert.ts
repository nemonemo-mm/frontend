import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getAlertAll, readAlert } from "../api/alert";
import type { AlertResponse } from "../types/alert.model";

export function useAlerts() {
  return useQuery<AlertResponse[]>({
    queryKey: ["alerts"],
    queryFn: getAlertAll,
  });
}

type ReadAlertPayload = string;

function invalidateAlertQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ["alerts"],
    exact: false,
  });
}

export function useAlertMutations() {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (alertId: ReadAlertPayload) => readAlert(alertId),
    onSuccess: () => {
      invalidateAlertQueries(queryClient);
    },
  });

  return {
    markAsRead,
  };
}
