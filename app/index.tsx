import { Redirect } from "expo-router";

export default function Index() {
  // auth 구현 전, 개발 편의를 위해 초기 진입 시 홈으로 리다이렉트
  return <Redirect href="/(tabs)/home" />;
}
