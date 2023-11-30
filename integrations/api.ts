import { UserNotFoundError } from "~/integrations/UserNotFoundError";

export {
  getFFZProfileByTwitchUsername,
  getFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
export {
  get7TVSetById,
  get7TVUserProfileByTwitchId,
} from "~/integrations/SevenTV/SevenTV.api";
export { getBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
export { UserNotFoundError };

export function isUserNotFoundError(
  error: unknown,
): error is UserNotFoundError {
  return error instanceof UserNotFoundError;
}
