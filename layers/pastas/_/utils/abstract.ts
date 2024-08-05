export interface IPastasRepository {
  add(pasta: MegaPasta): Promise<OmegaPasta["id"]>;
  put(pasta: OmegaPasta): Promise<void>;

  getAll(): Promise<OmegaPasta[]>;

  moveFromBinToList(pasta: OmegaPasta): Promise<void>;
  moveFromListToBin(pasta: OmegaPasta): Promise<void>;
}
