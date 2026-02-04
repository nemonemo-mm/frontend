import {
  globalGray0,
  globalGray400,
  globalGray500,
  globalGray700,
  globalGray900,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AlarmScreenProps {}

const AlarmScreen = ({}: AlarmScreenProps) => {
  const route = useRouter();
  const alarms = [
    {
      id: 3,
      content: "test alarm",
      teamId: 1,
      teamName: "NemoNemo",
      time: new Date(Date.now()),
      readAt: "",
    },
    {
      id: 1,
      content: "test alarm",
      teamId: 1,
      teamName: "NemoNemo",
      time: new Date(Date.now()),
      readAt: "2026-01-02",
    },
  ];
  return (
    <SafeAreaView>
      <Pressable style={styles.header} onPress={() => route.back()}>
        <AntDesign name="left" size={16} color={globalGray700} />
        <NemoText level="h2">알림</NemoText>
      </Pressable>
      <FlatList
        contentContainerStyle={{ padding: 20 }}
        data={alarms}
        keyExtractor={(item) => `alarm-${item.id}`}
        renderItem={({ item }) => (
          <Pressable
            style={styles.alarmContainer}
            onPress={() => route.push(`/(tabs)/${item.teamId}/calendar`)}
          >
            <NemoText
              level="body2"
              style={{ color: item.readAt ? globalGray500 : globalGray900 }}
            >
              {item.content}
            </NemoText>
            <NemoText
              level="body3"
              style={{ color: item.readAt ? globalGray400 : globalGray700 }}
            >
              {item.teamName}
              {" • "}
              {item.time.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </NemoText>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  alarmContainer: {
    backgroundColor: globalGray0,
    borderRadius: globalSpacingXs,
    padding: globalSpacingXs,
    gap: globalSpacingXs,
    marginBottom: 8,
  },
});

export default AlarmScreen;
