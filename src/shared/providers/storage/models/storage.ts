export default interface IStorage {
  save(file: string): Promise<string>;
  delete(file: string): Promise<void>;
}
