import { Image, StyleSheet, View } from "react-native";
import UserIcon from "../../../assets/icons/user";

interface ProfileImageProps {
  uri?: string;
  size: number;
}

const ProfileImage = ({ uri, size }: ProfileImageProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size }]}
          resizeMode="cover"
        />
      ) : (
        <UserIcon size={size} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    borderRadius: 9999,
  },
});

export default ProfileImage;
