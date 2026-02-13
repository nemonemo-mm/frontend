import ChevronLeftIcon from "@/assets/icons/chevron-left";
import { teamUpdateIntroduction } from "@/features/team/api/update";
import Input from "@/shared/ui/atoms/Input";
import NemoText from "@/shared/ui/atoms/NemoText";
import ModalButton from "@/shared/ui/molecules/ModalButton";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditIntroductionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { teamId } = useLocalSearchParams();
  const [introduction, setIntroduction] = useState("");

  const handleUpdateIntroduction = async () => {
    const parsedTeamId = Array.isArray(teamId)
      ? Number(teamId[0])
      : Number(teamId);

    if (!Number.isFinite(parsedTeamId)) {
      console.log("Invalid teamId:", teamId);
      return;
    }

    try {
      await teamUpdateIntroduction(parsedTeamId, { description: introduction });
      await queryClient.invalidateQueries({
        queryKey: ["teamDetail", parsedTeamId],
      });
      router.back();
    } catch (error) {
      console.log("Failed to update introduction:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Pressable
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              height: 56,
            }}
          >
            <ChevronLeftIcon size={16} />
            <NemoText level="h3">팀 소개 수정</NemoText>
          </Pressable>

          <View style={styles.inputContainer}>
            <Input
              placeholder="팀 소개 입력"
              multiline
              numberOfLines={2}
              scrollEnabled={false}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={Keyboard.dismiss}
              style={styles.introductionInput}
              textAlignVertical="top"
              value={introduction}
              maxLength={50}
              onChangeText={(text) =>
                setIntroduction(text.replace(/\r?\n/g, " "))
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View>
        <ModalButton
          label="변경하기"
          variant="primary"
          onPress={handleUpdateIntroduction}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    marginTop: 20,
  },
  introductionInput: {
    height: 60,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
