import { globalGray50 } from "@/shared/ui";
import { Stack } from "expo-router";

export default function TeamMembersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: globalGray50,
        },
      }}
    >
      <Stack.Screen name="members" />
    </Stack>
  );
}
