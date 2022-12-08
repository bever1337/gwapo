export interface Item {
  /**
   * The item id.
   */
  id: number;
  /**
   * The chat link.
   */
  chat_link: string;
  /**
   * The item name.
   */
  name: string;
  /**
   * full icon URL.
   */
  icon?: string;
  /**
   * The item description.
   */
  description?: string;
  /**
   * The item type.
   */
  type:
    | "Armor"
    | "Back"
    | "Bag"
    | "Consumable"
    | "Container"
    | "CraftingMaterial"
    | "Gathering"
    | "Gizmo"
    | "JadeTechModule"
    | "Key"
    | "MiniPet"
    | "PowerCore"
    | "Tool"
    | "Trait"
    | "Trinket"
    | "Trophy"
    | "UpgradeComponent"
    | "Weapon";
  /**
   * The item rarity.
   */
  rarity:
    | "Junk"
    | "Basic"
    | "Fine"
    | "Masterwork"
    | "Rare"
    | "Exotic"
    | "Ascended"
    | "Legendary";
  /**
   * The required level.
   */
  level: number;
  /**
   * The value in coins when selling to a vendor. (Can be non-zero even when the item has the NoSell flag.)
   */
  vendor_value: number;
  /**
   * The default skin id.
   */
  default_skin?: number;
  /**
   * Flags applying to the item.
   */
  flags: (
    | "AccountBindOnUse"
    | "AccountBound"
    | "Attuned"
    | "BulkConsume"
    | "DeleteWarning"
    | "HideSuffix"
    | "Infused"
    | "MonsterOnly"
    | "NoMysticForge"
    | "NoSalvage"
    | "NoSell"
    | "NotUpgradeable"
    | "NoUnderwater"
    | "SoulbindOnAcquire"
    | "SoulBindOnUse"
    | "Tonic"
    | "Unique"
  )[];
  /**
   * The game types in which the item is usable. At least one game type is specified.
   */
  game_types: ("Activity" | "Dungeon" | "Pve" | "Pvp" | "PvpLobby" | "Wvw")[];
  /**
   * Restrictions applied to the item.
   */
  restrictions: (
    | "Asura"
    | "Charr"
    | "Female"
    | "Human"
    | "Norn"
    | "Sylvari"
    | "Elementalist"
    | "Engineer"
    | "Guardian"
    | "Mesmer"
    | "Necromancer"
    | "Ranger"
    | "Thief"
    | "Warrior"
  )[];
  /**
   * Lists what items this item can be upgraded into, and the method of upgrading.
   */
  upgrades_into?: {
    /**
     * The item ID that results from performing the upgrade.
     */
    item_id?: number;
    upgrade?: "Attunement" | "Infusion";
  }[];
  /**
   * Lists what items this item can be upgraded from, and the method of upgrading. See upgrades_into for format.
   */
  upgrades_from?: {
    /**
     * The item ID that resulted from performing the upgrade.
     */
    item_id?: number;
    upgrade?: "Attunement" | "Infusion";
  }[];
  /**
   * Additional item details if applicable, depending on the item type
   */
  details?: {
    [k: string]: unknown;
  };
}
