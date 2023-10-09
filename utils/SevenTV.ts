import type { SevenTvEmote } from "#imports";

export class SevenTV {
  shouldLog = false;

  async fetchUserById(accountId: string) {
    return fetch(`https://7tv.io/v3/users/${accountId}`)
      .then((response) => {
        return response.json();
      })
      .then((streamerProfile) => {
        if (this.shouldLog) {
          console.log({ streamerProfile });
        }
        return new SevenTVUser(streamerProfile);
      });
  }
}

export function SevenTVEmoteString(emote: SevenTvEmote) {
  return String.raw`
    <span
      class="inline-block"
      title="${emote.chatName} emote from SevenTV ${
        !emote.originalName ? "" : `(aka ${emote.originalName})`
      }"
    >
      <img src="https:${emote.url}/1x.webp">
    </span>
  `;
}
