import {
  globalGray0,
  globalGray200,
  globalGray400,
  globalGray700,
  globalGray900,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import Toggle from "@/shared/ui/atoms/Toggle";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyAlarmProps {}

const MyAlarm = ({}: MyAlarmProps) => {
  const route = useRouter();
  //개인 알림 설정 토글용 설정값입니다.
  const [isAll, setIsAll] = useState(true);

  // 세부 설정 상태 관리
  const [detailSettings, setDetailSettings] = useState({
    scheduleChange: true,
    todoChange: true,
    notice: true,
  });

  // 전체 알림 토글 핸들러
  const handleAllToggle = () => {
    setIsAll((prev) => {
      const next = !prev;
      // 전체 알림을 끄면 세부 알림도 모두 끔(false) 처리
      if (!next) {
        setDetailSettings({
          scheduleChange: false,
          todoChange: false,
          notice: false, // 공지 알림도 포함하여 끔 설정
        });
      }
      return next;
    });
  };

  // 개별 토글 핸들러
  const handleDetailToggle = (key: keyof typeof detailSettings) => {
    // 전체 알림이 꺼져있으면 조작 불가 (disabled 처리는 UI에서 하지만 로직 방어)
    if (!isAll) return;

    setDetailSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Pressable onPress={() => route.back()}>
          <AntDesign name="left" size={16} color={globalGray700} />
        </Pressable>
        <NemoText level="h3">개인 알림 설정</NemoText>
      </View>
      <View style={styles.main}>
        <View style={[styles.linkContainer, styles.link]}>
          <NemoText level="body2" style={{ color: globalGray900 }}>
            개인 알림 허용
          </NemoText>
          <Toggle value={isAll} handler={handleAllToggle} />
        </View>
        <View style={[styles.linkContainer]}>
          <View style={styles.link}>
            <NemoText
              level="body2"
              style={{ color: isAll ? globalGray900 : globalGray400 }}
            >
              스케줄 변경 알림
            </NemoText>
            <Toggle
              value={detailSettings.scheduleChange}
              handler={() => handleDetailToggle("scheduleChange")}
              disabled={!isAll} // 전체 알림 꺼짐 시 비활성화
            />
          </View>
          <View style={styles.border} />
          <View style={styles.link}>
            <NemoText
              level="body2"
              style={{ color: isAll ? globalGray900 : globalGray400 }}
            >
              스케줄 마감 알림
            </NemoText>
            <NemoText
              level="body2"
              style={{ color: isAll ? globalGray900 : globalGray400 }}
            >
              끔
            </NemoText>
          </View>
        </View>
        <View style={[styles.linkContainer]}>
          <View style={styles.link}>
            <NemoText
              level="body2"
              style={{ color: isAll ? globalGray900 : globalGray400 }}
            >
              투두 변경 알림
            </NemoText>
            <Toggle
              value={detailSettings.todoChange}
              handler={() => handleDetailToggle("todoChange")}
              disabled={!isAll}
            />
          </View>
          <View style={styles.border} />
          <View style={styles.link}>
            <NemoText
              level="body2"
              style={{ color: isAll ? globalGray900 : globalGray400 }}
            >
              투두 마감 알림
            </NemoText>
            <NemoText
              level="body2"
              style={{ color: isAll ? globalGray900 : globalGray400 }}
            >
              끔
            </NemoText>
          </View>
        </View>
        <View style={[styles.linkContainer, styles.link]}>
          <NemoText
            level="body2"
            style={{ color: isAll ? globalGray900 : globalGray400 }}
          >
            공지 알림
          </NemoText>
          <Toggle
            value={detailSettings.notice}
            handler={() => handleDetailToggle("notice")}
            disabled={!isAll}
          />
        </View>
      </View>
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
  main: {
    padding: 20,
  },
  border: {
    height: 1,
    backgroundColor: globalGray200,
  },
  linkContainer: {
    borderRadius: globalSpacingSm,
    backgroundColor: globalGray0,
    marginBottom: globalSpacingMd,
    overflow: "hidden",
  },
  link: {
    paddingHorizontal: globalSpacingXs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: globalGray0,
    height: 48,
  },
});
export default MyAlarm;
