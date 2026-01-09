import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
        }}
      />
      <Tabs.Screen
        name="personal"
        options={{
          title: "",
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "",
        }}
      />
    </Tabs>
  );
}
