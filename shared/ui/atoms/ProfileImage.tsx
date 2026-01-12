import { Image, StyleSheet, View } from "react-native";

const defaultUserImage = require("../../../assets/icons/user.svg");

interface ProfileImageProps {
  uri?: string;
  size?: number;
}

const ProfileImage = ({ uri, size }: ProfileImageProps) => {
  const imageSource = uri ? { uri } : defaultUserImage;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={{ width: size, height: size }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});

export default ProfileImage;
