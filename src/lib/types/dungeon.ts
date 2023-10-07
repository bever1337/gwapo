import type { Achievement } from "./achievement";

export interface Dungeon {
  id: string;
  paths: {
    id: string;
    type: "Explorable" | "Story";
  }[];
}
export interface DungeonDoc extends Dungeon {
  _id: `dungeons_${Dungeon["id"]}`;
  $id: "gwapo/dungeons";
  achievementId: Achievement["id"];
}
