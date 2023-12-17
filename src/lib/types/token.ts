export interface AccessToken {
  id: string;
  name: string;
  permissions: Scope[];
  type: string;
  expires_at?: string;
  issued_at?: string;
  urls?: string[];
}

export enum Scope {
  Account = "account",
  Builds = "builds",
  Characters = "characters",
  Guilds = "guilds",
  Inventories = "inventories",
  Progression = "progression",
  Pvp = "pvp",
  TradingPost = "tradingpost",
  Unlocks = "unlocks",
  Wallet = "wallet",
}
