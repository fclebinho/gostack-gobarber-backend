export default interface IHash {
  generate(playload: string): Promise<string>;
  compare(payload: string, hashed: string): Promise<boolean>;
}
