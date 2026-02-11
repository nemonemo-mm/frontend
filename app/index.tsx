import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "@/features/auth/utils/tokenStorage";
import { teamListUp } from "@/features/team/api/list";
import { getMe } from "@/features/users/api/user";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [redirectHref, setRedirectHref] = useState<string>("/auth");

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          getAccessToken(),
          getRefreshToken(),
        ]);

        const hasStoredToken = Boolean(accessToken || refreshToken);
        if (!hasStoredToken) {
          if (!mounted) return;
          setRedirectHref("/auth");
          return;
        }

        await getMe();

        const teams = await teamListUp();
        const nextHref =
          teams && teams.length > 0
            ? `/(tabs)/${teams[0].teamId}/calendar`
            : "/(tabs)/0";

        if (!mounted) return;
        setRedirectHref(nextHref);
      } catch {
        await clearTokens();

        if (!mounted) return;
        setRedirectHref("/auth");
      } finally {
        if (!mounted) return;
        setIsReady(true);
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <Redirect href={redirectHref as any} />;
}
