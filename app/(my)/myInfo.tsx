import {
  globalGray0,
  globalGray700,
  globalGray900,
  globalRed600,
  globalSpacingLg,
  globalSpacingMd,
  globalSpacingSm,
  globalSpacingXs,
} from "@/shared/ui";
import NemoText from "@/shared/ui/atoms/NemoText";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyInfoProps {}

const MyInfo = ({}: MyInfoProps) => {
  const route = useRouter();
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Pressable onPress={() => route.back()}>
          <AntDesign name="left" size={16} color={globalGray700} />
        </Pressable>
        <NemoText level="h3">내 정보관리</NemoText>
      </View>
      <View style={styles.main}>
        <View style={styles.profileSection}>
          <ProfileImage size={64} />
          <Pressable style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={globalGray700} />
          </Pressable>
        </View>
        <Pressable style={[styles.linkContainer, styles.link]}>
          <NemoText
            level="h2"
            style={{ color: globalGray900, textAlign: "center" }}
          >
            userName
          </NemoText>
          <Feather name="edit-2" size={16} color={globalGray700} />
        </Pressable>
      </View>
      <View style={styles.footer}>
        <NemoText level="body1" style={{ color: globalRed600 }}>
          탈퇴하기
        </NemoText>
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
  profileSection: {
    justifyContent: "center",
    alignContent: "center",
    margin: "auto",
    gap: globalSpacingSm,
    marginBottom: 20,
    position: "relative",
  },
  editBtn: {
    position: "absolute",
    backgroundColor: globalGray0,
    borderRadius: globalSpacingLg,
    padding: 6,
    bottom: -6,
    right: 0,
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
  footer: {
    margin: "auto",
    marginTop: 488,
    marginBottom: 18,
  },
});
export default MyInfo;
