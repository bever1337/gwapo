export const COPPER = 1;
export const SILVER = COPPER * 100;
export const GOLD = SILVER * 100;

export enum Coins {
  Gold,
  Silver,
  Copper,
}

export const separateCopperCoins = (remainingCopperCoins: number) => {
  const coins = [];
  coins[Coins.Gold] = Math.floor(remainingCopperCoins / GOLD);
  remainingCopperCoins %= GOLD;
  coins[Coins.Silver] = Math.floor(remainingCopperCoins / SILVER);
  remainingCopperCoins %= SILVER;
  coins[Coins.Copper] = remainingCopperCoins;
  return coins;
};
