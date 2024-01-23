import { z } from "zod";
import {
  type EmoteSource,
  emoteSources,
  getGlobalCollection,
} from "~/integrations";
import { flatGroupBy } from "~/utils/object";

export const getCachedGlobalCollection = defineCachedFunction(
  async (source: EmoteSource) => await getGlobalCollection(source),
  {
    maxAge: 60 * 60 /* 1 hour */,
    name: "global-collection",
    getKey: (source: EmoteSource) => source,
  },
);

const MAX_PARAMS_LENGTH = emoteSources.reduce(
  (acc, source) => acc + source.length,
  emoteSources.length as number,
);

const querySchema = z.object({
  sources: z
    .string()
    .max(MAX_PARAMS_LENGTH)
    .optional()
    .transform((sources) => {
      if (!sources) {
        return emoteSources;
      }
      return Object.freeze(
        sources
          .split(" ")
          .filter((source): source is EmoteSource =>
            emoteSources.includes(source as EmoteSource),
          ),
      );
    }),
});

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { sources } = querySchema.parse(query);
  const noValidSource = !sources.length;
  if (noValidSource) {
    return setResponseStatus(event, 204);
  }
  const collections = await Promise.all(sources.map(getCachedGlobalCollection));
  const groupedBySource = flatGroupBy(
    collections,
    (collection) => collection.source,
  );
  return groupedBySource;
});
