import EditIcon from "@/assets/icons/edit";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface EditableProfileImageProps {
  size: number;
  onEditPress: () => void;
  imageUri?: string;
}

export default function EditableProfileImage({
  size,
  onEditPress,
  imageUri,
}: EditableProfileImageProps) {
  return (
    <Pressable
      onPress={onEditPress}
      style={({ pressed }) => [
        { width: size, height: size },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.container, { width: size, height: size }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { width: size, height: size }]}
            resizeMode="cover"
          />
        ) : (
          <ProfileImage size={size} />
        )}
        <EditIcon style={styles.editButton} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    borderRadius: 9999,
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
