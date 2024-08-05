const appIndexedDBPromise = openAppIndexedDBDatabase();

const withAppIndexedDB = withIndexedDBDatabase(
  appIndexedDBPromise,
) satisfies WithAppIndexedDB;

export const keyValueRepository = new KeyValueIndexedDBRepository(
  new KeyValueIndexedDBStore(withAppIndexedDB),
);
