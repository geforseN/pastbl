export default {
  byLatest: (pastas: MegaPasta[]) => {
    return pastas.toSorted((a, b) => a.createdAt - b.createdAt);
  },
  byNewest: (pastas: MegaPasta[]) => {
    return pastas.toSorted((a, b) => b.createdAt - a.createdAt);
  },
};
