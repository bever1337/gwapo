import { readCharactersCore } from "../../features/store/api/read-character-core";

export function Option({ characterName }: { characterName: string }) {
  // preload character data
  readCharactersCore.useQuery({ characterName });
  return <option value={characterName}>{characterName}</option>;
}
