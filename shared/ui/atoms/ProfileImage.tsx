import { Image } from "react-native";

const defaultUserImage = require("../../../assets/icons/user.svg");

interface ProfileImageProps {
  uri?: string;
  size?: number;
}

const ProfileImage = ({ uri, size }: ProfileImageProps) => {
  const imageSource = uri ? { uri } : defaultUserImage;

  return <Image source={imageSource} style={{ width: size, height: size }} />;
};

export default ProfileImage;
