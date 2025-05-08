import { watchImmediate, until } from "@vueuse/core";
import LogRocket from "logrocket";
import { log } from "../../shared/utils/dev-only";
import { useIndexedDBKeyValue } from "../../layers/key-value/indexed-db/composables/useIndexedDBKeyValue";

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

  watchImmediate(userSession.ready, async () => {
    const loggedIn = userSession.loggedIn.value;
    const uid = await getLogRocketUserId(userSession, loggedIn);
    log("debug", "session", { loggedIn, uid });
    LogRocket.identify(uid, { loggedIn });
  });
}
