const pastasIndexedDBPromise = openPastasIndexedDB();

const withPastasIndexedDB = withIndexedDBDatabase(pastasIndexedDBPromise);

export const pastasService = new PastasService(
  new PastasIndexedDBRepository(
    new PastasListIndexedDBStore(withPastasIndexedDB),
    new PastasIndexedDBTransactions(withPastasIndexedDB),
  ),
);
