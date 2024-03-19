export const pluralRules = {
  // TODO: refactor, make fast return of 3
  ru(choice: number, choicesLength: number, orgRule: unknown) {
    if (choice === 0) {
      return 0;
    }
    const last = choice % 10;
    const isTeen = choice > 10 && choice < 20;
    if (choicesLength < 4) {
      if (!isTeen && last === 1) {
        return 1;
      }
      return 2;
    }
    if (!isTeen) {
      if (last === 1) {
        return 1;
      }
      if (last >= 2 && last <= 4) {
        return 2;
      }
    }
    return 3;
  },
};
