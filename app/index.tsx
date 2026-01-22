import { Redirect } from "expo-router";

export default function Index() {
  // if (__DEV__) {
  //   return <Redirect href="/auth" />;
  // }

  return <Redirect href="/(tabs)/home" />;
}
