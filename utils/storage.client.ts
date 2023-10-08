export const sevenTvAccounts = useLocalStorage("7tv::accounts", [], {
  serializer: zipsonSerializer,
});
