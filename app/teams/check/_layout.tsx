import { Stack } from "expo-router";

export default function TeamExistenceCheckLayout() {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
        <Stack.Screen name="join" />
      </Stack>
    );
  }
  