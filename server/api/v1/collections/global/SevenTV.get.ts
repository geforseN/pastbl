import { ReadyOrFailedIntegration } from "~/integrations/integrations";
import { findErrorMessage } from "~/utils/error";

const source = "SevenTV";

export default defineEventHandler(async () => {
  console.log("GET api/collections/global/SevenTV");
  const integration = await getSevenTVGlobalCollection()
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
