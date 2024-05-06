import { emoteSources } from "~/integrations";
import type { ReadyOrFailedEmoteIntegrationsRecord } from "~/integrations/integrations";
import { flatGroupBySource } from "~/utils/emote-collection";

export default defineEventHandler(async () => {
  const record = await getAllGlobalEmoteCollections();
  const values = emoteSources.map(
    (source) => record[source] || { source, status: "failed" },
  );
  return flatGroupBySource(
    values,
  ) satisfies ReadyOrFailedEmoteIntegrationsRecord;
});
