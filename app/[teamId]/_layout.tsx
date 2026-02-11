import { globalGray50 } from "@/shared/ui";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: globalGray50 },
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: globalGray50 },
        }}
      />
    </Stack>
  );
}
