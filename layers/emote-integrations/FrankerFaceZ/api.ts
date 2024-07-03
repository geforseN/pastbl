import { PersonIntegrationNotFoundError } from "../UserNotFoundError";
import { assert } from "~/utils/error";

// LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1

export const api = {
  async getPersonProfile(id: TwitchUserId, login: TwitchUserLogin) {
    const response = await fetch(
      `https://api.frankerfacez.com/v1/user/id/${id}`,
    );
    assert.response.ok(
      response,
      new PersonIntegrationNotFoundError("FrankerFaceZ", login),
    );
    const json = await response.json();
    return json as IFrankerFaceZ.API.UserStruct;
  },
  async getPersonRoom(twitchId: TwitchUserId) {
    const response = await fetch(
      `https://api.frankerfacez.com/v1/room/id/${twitchId}`,
    );
    assert.response.ok(
      response.clone(),
      "Failed to load FrankerFaceZ user emotes",
    );
    const json = await response.json();
    return json as IFrankerFaceZ.API.RoomStruct;
  },
  async getGlobalEmotes() {
    const response = await fetch(
      "https://api.frankerfacez.com/v1/set/global/ids",
    );
    assert.response.ok(response, "Failed to load FrankerFaceZ global emotes");
    const json = await response.json();
    return json as IFrankerFaceZ.API.GlobalStruct;
  },
};
