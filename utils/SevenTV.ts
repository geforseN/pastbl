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
