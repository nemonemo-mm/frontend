import MainIcon from "@/assets/icons/main";
import MyPageIcon from "@/assets/icons/mypage";
import PersonalIcon from "@/assets/icons/personal";
import { globalGreen300 } from "@/shared/ui";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: globalGreen300,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <MainIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="personal"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <PersonalIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <MyPageIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
