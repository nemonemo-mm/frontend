import { globalGray50 } from "@/shared/ui";
import { getAlertNavigationTarget } from "@/shared/utils/alertNavigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  addNotificationResponseReceivedListener,
  useLastNotificationResponse,
} from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
const queryClient = new QueryClient();
export default function RootLayout() {
  const router = useRouter();
  const lastNotificationResponse = useLastNotificationResponse();

  const handleRouting = (data: any) => {
    const target = getAlertNavigationTarget({
      type: data?.type,
      teamId: data?.teamId,
    });
    if (!target) return;

    if (target.method === "replace") {
      router.replace(target.href as Href);
      return;
    }

    router.push(target.href as Href);
  };

  // 🔹 앱이 종료 상태였다가 켜진 경우 처리
  useEffect(() => {
    if (!lastNotificationResponse) return;

    const data = lastNotificationResponse.notification.request.content.data;

    handleRouting(data);
  }, [lastNotificationResponse]);

  // 🔹 클릭 이벤트 처리
  useEffect(() => {
    const responseListener = addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        handleRouting(data);
      }
    );

    return () => {
      responseListener.remove();
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: globalGray50 },
          }}
        >
          <Stack.Screen name="[teamId]" />
          <Stack.Screen name="auth" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
