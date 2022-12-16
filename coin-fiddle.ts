// playing around with reducing gw2 currencies
export const Copper = 1;
export const Silver = Copper * 100;
export const Gold = Silver * 100;

export enum Coins {
  Gold,
  Silver,
  Copper,
}

export const separateCopperCoins = (remainingCopperCoins: number) => {
  const coins = [0, 0, 0];
  coins[Coins.Gold] = Math.floor(remainingCopperCoins / Gold);
  remainingCopperCoins %= Gold;
  coins[Coins.Silver] = Math.floor(remainingCopperCoins / Silver);
  remainingCopperCoins %= Silver;
  coins[Coins.Copper] = remainingCopperCoins;
  return coins;
};

console.log(separateCopperCoins(10101));
