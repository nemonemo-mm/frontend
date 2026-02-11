import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import UserIcon from "../../../assets/icons/user";

interface ProfileImageProps {
  uri?: string;
  size: number;
}

const ProfileImage = ({ uri, size }: ProfileImageProps) => {
  const [isLoaded, setIsLoaded] = useState(!uri);

  useEffect(() => {
    setIsLoaded(!uri);
  }, [uri]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.fallback}>
        <UserIcon size={size} />
      </View>
      {uri && (
        <Image
          source={uri}
          style={[
            styles.image,
            { width: size, height: size, opacity: isLoaded ? 1 : 0 },
          ]}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={120}
          onLoadEnd={() => setIsLoaded(true)}
          onError={() => setIsLoaded(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
  },
});

export default ProfileImage;
