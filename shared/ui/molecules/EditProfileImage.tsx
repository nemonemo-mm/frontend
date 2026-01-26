import EditIcon from "@/assets/icons/edit";
import GroupIcon from "@/assets/icons/group";
import ProfileImage from "@/shared/ui/atoms/ProfileImage";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface EditProfileImageProps {
  size: number;
  onEditPress: () => void;
  imageUri?: string;
  variant?: "default" | "team";
}

export default function EditProfileImage({
  size,
  onEditPress,
  imageUri,
  variant = "default",
}: EditProfileImageProps) {
  const renderDefaultImage = () => {
    if (variant === "team") {
      return <GroupIcon size={size} />;
    }
    return <ProfileImage size={size} />;
  };

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
          renderDefaultImage()
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
