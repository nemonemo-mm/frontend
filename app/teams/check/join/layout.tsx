import { Stack } from "expo-router";

export default function JoinLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
