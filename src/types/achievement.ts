export interface AchievementCategory {
  achievements: Achievement["id"][];
  description: string;
  icon: string;
  id: number;
  name: string;
}
export interface AchievementCategoryDoc extends AchievementCategory {
  _id: `achievement_categories_${AchievementCategory["id"]}`;
  $id: "gwapo/achievement_categories";
}

export interface AcheivementGroup {
  categories: AchievementCategory["id"][];
  description: string;
  id: string;
  name: string;
  order: number;
}
export interface AcheivementGroupDoc extends AcheivementGroup {
  _id: `achievement_groups_${AcheivementGroup["id"]}`;
  $id: "gwapo/achievement_groups";
}

export interface Achievement {
  /**
   * Contains a number of objects, each corresponding to a
   * bitmask value that can give further information on the
   * progress towards the achievement.
   */
  bits?:
    | (
        | {
            /** The type of bit. Can be Text, Item, Minipet, or Skin. */
            type: "Text";
            /** The text for the bit, if type is Text. */
            text: string;
          }
        | {
            /** The type of bit. Can be Text, Item, Minipet, or Skin. */
            type: "Item" | "Minipet" | "Skin";
            /** The ID of the item, mini, or skin, if applicable. */
            id?: number;
          }
      )[];
  /** The achievement description. */
  description: string;
  /** Achievement categories. */
  flags: (
    | "Pvp"
    | "CategoryDisplay"
    | "MoveToTop"
    | "IgnoreNearlyComplete"
    | "Repeatable"
    | "Hidden"
    | "RequiresUnlock"
    | "RepairOnLogin"
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Permanent"
  )[];
  /** The achievement icon. */
  icon?: string;
  /** The achievement id. */
  id: number;
  /** The achievement description prior to unlocking it. */
  locked_text: string;
  /** The achievement name. */
  name: string;
  /** The maximum number of AP that can be rewarded by an achievement flagged as Repeatable. */
  point_cap?: number;
  /** Contains an array of achievement ids required to progress the given achievement. */
  prerequisites?: Achievement["id"][];
  /** The achievement requirement as listed in-game. */
  requirement: string;
  /** Describes the rewards given for the achievement. */
  rewards?:
    | (
        | {
            type: "Coins";
            /** The number of Coins to be rewarded. */
            count: number;
          }
        | {
            type: "Item";
            /** The item ID to be rewarded. */
            id: number;
            /** The number of id to be rewarded. */
            count: number;
          }
        | {
            type: "Mastery";
            /** The mastery point ID to be rewarded. */
            id: number;
            /** The region the Mastery Point applies to. Either Tyria, Maguuma, Desert or Tundra. */
            region: string;
          }
        | {
            type: "Title";
            /** The title id. */
            id: number;
          }
      )[];
  /** Describes the achievement's tiers. */
  tiers: {
    /** The number of "things" (achievement-specific) that must be completed to achieve this tier. */
    count: number;
    /** The amount of AP awarded for completing this tier. */
    points: number;
  }[];
  /**
   * The achievement type.
   * Default - A default achievement.
   * ItemSet - Achievement is linked to Collections
   */
  type: "Default" | "ItemSet";
}
export interface AcheivementDoc extends Achievement {
  _id: `achievements_${Achievement["id"]}`;
  $id: "gwapo/achievements";
  category: AchievementCategory["id"];
  group: AcheivementGroup["id"];
}
