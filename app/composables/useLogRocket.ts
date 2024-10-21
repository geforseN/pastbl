import LogRocket from "logrocket";

export function useLogRocket(
  strategy: "ignore-all" | "init" | "init&identify" = "init&identify",
) {
  if (!strategy || strategy === "ignore-all") {
    return;
  }
  LogRocket.init("lkrbqs/pastbl-prod");
  if (!strategy.endsWith("identify")) {
    return;
  }

  const userSession = useUserSession();

  async function getLogRocketUserId(
    userSession: ReturnType<typeof useUserSession>,
    isLoggedIn: boolean,
  ) {
    const login = userSession.user.value?.twitch?.login;
    if (isLoggedIn && login) {
      return login;
    }
    const nickname = useIndexedDBKeyValue("nickname:value", "Kappa");
    await until(nickname.isRestored).toBeTruthy();
    return nickname.state.value || "unknown";
  }

  whenever(userSession.ready, async () => {
    const loggedIn = userSession.loggedIn.value;
    const uid = await getLogRocketUserId(userSession, loggedIn);
    LogRocket.identify(uid, { loggedIn });
  });
}
