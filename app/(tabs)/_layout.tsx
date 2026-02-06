import MainIcon from "@/assets/icons/main";
import MyPageIcon from "@/assets/icons/mypage";
import {
  globalGray400,
  globalGray50,
  globalGreen300,
  globalGreen400,
} from "@/shared/ui";
import { Entypo } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
export default function TabsLayout() {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: globalGreen300,
          tabBarStyle: { backgroundColor: globalGray50, borderTopWidth: 0 },
          headerStyle: {
            backgroundColor: globalGray50,
          },
          headerShadowVisible: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="[teamId]"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <MainIcon color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name={"home"}
          initialParams={{ openModal: true }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();

              // my 탭에서는 모달 열면 안 된다면
              if (pathName.startsWith("/my")) return;
              if (pathName.includes("calendar"))
                // 현재 teamId 경로에 openModal 트리거만 붙임
                router.push(`${pathName}?openModal=true` as any);
            },
          }}
          options={{
            title: "",
            tabBarIcon: () => (
              <Entypo
                name="circle-with-plus"
                size={24}
                color={
                  pathName.startsWith("/my") ? globalGray400 : globalGreen400
                }
                style={{
                  transform: [{ translateY: -10 }, { scale: 2 }],
                  backgroundColor: globalGray50,
                  borderRadius: 9999,
                  padding: 0.1,
                }}
              />
            ),
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
    </>
  );
}
