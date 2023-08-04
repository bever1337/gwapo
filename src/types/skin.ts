export interface Skin {
  description?: string;
  details?: any;
  flags: ("ShowInWardrobe" | "NoCost" | "HideIfLocked" | "OverrideRarity")[];
  icon: string;
  id: number;
  name: string;
  rarity: string;
  restrictions: string[];
  type: SkinType;
}
export interface SkinDoc extends Skin {
  _id: `skins_${Skin["id"]}`;
  $id: "gwapo/skins";
}

export enum SkinType {
  Armor = "Armor",
  Weapon = "Weapon",
  Back = "Back",
  Gathering = "Gathering",
}

export enum ArmorType {}

export enum WeaponType {}

export enum BackType {}

export enum GatheringType {
  Foraging = "Foraging",
  Logging = "Logging",
  Mining = "Mining",
}
