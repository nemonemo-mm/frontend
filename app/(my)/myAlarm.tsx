import {
  getNotificationSettings,
  NotificationSettings,
  updateNotificationSettings,
} from "@/features/notifications/api/notification";
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
import AlarmModal, { AlarmState } from "@/shared/ui/templates/AlarmModal";
import { formatAlarm } from "@/shared/utils/format";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyAlarmProps {}

const defaultSettings: NotificationSettings = {
  enableAllPersonalNotifications: false,
  enableScheduleChangeNotification: false,
  enableSchedulePreNotification: false,
  schedulePreNotificationMinutes: [],
  enableTodoChangeNotification: false,
  enableTodoDeadlineNotification: false,
  todoDeadlineNotificationMinutes: [],
  enableNoticeNotification: false,
};

const toAlarmState = (minutes: number[]): AlarmState => ({
  10: minutes.includes(10),
  30: minutes.includes(30),
  60: minutes.includes(60),
});

const toAlarmMinutes = (alarm: AlarmState): number[] =>
  [10, 30, 60].filter((minute) => alarm[minute as keyof AlarmState]);

const hasAlarm = (alarm: AlarmState) => toAlarmMinutes(alarm).length > 0;

const MyAlarm = ({}: MyAlarmProps) => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false);
  const [isOpenTodoModal, setIsOpenTodoModal] = useState(false);

  // API 연동
  const { data: serverSettings } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: getNotificationSettings,
  });
  const updateMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["notificationSettings"], updatedSettings);
    },
  });

  // 서버 데이터가 로드되면 로컬 상태 동기화
  useEffect(() => {
    if (serverSettings !== undefined && serverSettings !== null) {
      setSettings(serverSettings);
      return;
    }
    if (serverSettings === null) {
      setSettings(defaultSettings);
    }
  }, [serverSettings]);

  const updateSettings = (
    updater: (prevSettings: NotificationSettings) => NotificationSettings,
  ) => {
    setSettings((prevSettings) => {
      const currentSettings = prevSettings ?? defaultSettings;
      const nextSettings = updater(currentSettings);

      updateMutation.mutate(nextSettings, {
        onError: () => {
          setSettings(currentSettings);
        },
      });

      return nextSettings;
    });
  };

  const isAll = settings.enableAllPersonalNotifications;
  const schedulePreAlarmState = toAlarmState(
    settings.schedulePreNotificationMinutes,
  );
  const todoDeadlineAlarmState = toAlarmState(
    settings.todoDeadlineNotificationMinutes,
  );

  const schedulePreAlarmLabel = formatAlarm(schedulePreAlarmState);
  const todoDeadlineAlarmLabel = formatAlarm(todoDeadlineAlarmState);

  // 전체 알림 토글 핸들러
  const handleAllToggle = (value: boolean) => {
    updateSettings((prevSettings) => ({
      ...prevSettings,
      enableAllPersonalNotifications: value,
      ...(value
        ? {}
        : {
            enableScheduleChangeNotification: false,
            enableSchedulePreNotification: false,
            schedulePreNotificationMinutes: [],
            enableTodoChangeNotification: false,
            enableTodoDeadlineNotification: false,
            todoDeadlineNotificationMinutes: [],
            enableNoticeNotification: false,
          }),
    }));
  };

  const handleScheduleChangeToggle = (value: boolean) => {
    if (!isAll) return;
    updateSettings((prevSettings) => ({
      ...prevSettings,
      enableScheduleChangeNotification: value,
    }));
  };

  const handleTodoChangeToggle = (value: boolean) => {
    if (!isAll) return;
    updateSettings((prevSettings) => ({
      ...prevSettings,
      enableTodoChangeNotification: value,
    }));
  };

  const handleNoticeToggle = (value: boolean) => {
    if (!isAll) return;
    updateSettings((prevSettings) => ({
      ...prevSettings,
      enableNoticeNotification: value,
    }));
  };

  const handleScheduleDeadlineConfirm = (alarmState: AlarmState) => {
    const alarmMinutes = toAlarmMinutes(alarmState);
    updateSettings((prevSettings) => ({
      ...prevSettings,
      enableSchedulePreNotification: hasAlarm(alarmState),
      schedulePreNotificationMinutes: alarmMinutes,
    }));
  };

  const handleTodoDeadlineConfirm = (alarmState: AlarmState) => {
    const alarmMinutes = toAlarmMinutes(alarmState);
    updateSettings((prevSettings) => ({
      ...prevSettings,
      enableTodoDeadlineNotification: hasAlarm(alarmState),
      todoDeadlineNotificationMinutes: alarmMinutes,
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
              value={settings.enableScheduleChangeNotification}
              handler={handleScheduleChangeToggle}
              disabled={!isAll} // 전체 알림 꺼짐 시 비활성화
            />
          </View>
          <View style={styles.border} />
          <Pressable
            style={styles.link}
            onPress={() => isAll && setIsOpenScheduleModal(true)}
            disabled={!isAll}
          >
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
              {schedulePreAlarmLabel}
            </NemoText>
          </Pressable>
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
              value={settings.enableTodoChangeNotification}
              handler={handleTodoChangeToggle}
              disabled={!isAll}
            />
          </View>
          <View style={styles.border} />
          <Pressable
            style={styles.link}
            onPress={() => isAll && setIsOpenTodoModal(true)}
            disabled={!isAll}
          >
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
              {todoDeadlineAlarmLabel}
            </NemoText>
          </Pressable>
        </View>
        <View style={[styles.linkContainer, styles.link]}>
          <NemoText
            level="body2"
            style={{ color: isAll ? globalGray900 : globalGray400 }}
          >
            공지 알림
          </NemoText>
          <Toggle
            value={settings.enableNoticeNotification}
            handler={handleNoticeToggle}
            disabled={!isAll}
          />
        </View>
      </View>
      {isOpenScheduleModal && (
        <AlarmModal
          initialValue={schedulePreAlarmState}
          closeModal={() => setIsOpenScheduleModal(false)}
          confirmModal={handleScheduleDeadlineConfirm}
        />
      )}
      {isOpenTodoModal && (
        <AlarmModal
          initialValue={todoDeadlineAlarmState}
          closeModal={() => setIsOpenTodoModal(false)}
          confirmModal={handleTodoDeadlineConfirm}
        />
      )}
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
