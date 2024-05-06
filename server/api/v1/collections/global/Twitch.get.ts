import { ReadyOrFailedIntegration } from "~/integrations/integrations";
import { findErrorMessage } from "~/utils/error";

const source = "Twitch";

export default defineEventHandler(async () => {
  console.log("GET api/collections/global/Twitch");
  const integration = await getTwitchGlobalCollection()
    .then((integration) => ({ ...integration, status: "ready" }) as const)
    .catch((reason) => ({
      source,
      status: "failed",
      reason: findErrorMessage(
        reason,
        `Failed to load ${source} Global Emote Integration`,
      ),
    }));
  return integration as ReadyOrFailedIntegration<typeof source>;
});
