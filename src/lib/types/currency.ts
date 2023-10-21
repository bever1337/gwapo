export const COPPER = 1;
export const SILVER = COPPER * 100;
export const GOLD = SILVER * 100;

export enum Coin {
	Gold,
	Silver,
	Copper
}

export type CoinWallet = [Gold: number, Silver: number, Copper: number];

export const separateCopperCoins = (remainingCopperCoins: number): CoinWallet => {
	const coins: CoinWallet = [0, 0, 0];
	coins[Coin.Gold] = Math.floor(remainingCopperCoins / GOLD);
	remainingCopperCoins %= GOLD;
	coins[Coin.Silver] = Math.floor(remainingCopperCoins / SILVER);
	remainingCopperCoins %= SILVER;
	coins[Coin.Copper] = remainingCopperCoins;
	return coins;
};
