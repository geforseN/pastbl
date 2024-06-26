import type { H3Event, EventHandlerRequest } from "h3";

export type H3E = H3Event<EventHandlerRequest>;

export { getTwitchChannels } from "~~/layers/twitch-channels-search/utils/server";
