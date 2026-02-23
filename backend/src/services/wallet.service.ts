import Wallet from "../models/Wallet.js";

export const findWallet = async(id: string) => {
 const wallet = await Wallet.findOne({ where: { user_id: id } });
 if(!wallet) return wallet;

const balance = Number(wallet?.balance) || 0;

return wallet
}

export const editWallet = async (
  id: string,
    walletData
  : { wallet_type: string; lower_threshold: number; upper_threshold: number },
  userId: string
) => {
  const wallet = await Wallet.findOne({ where: { user_id: userId } });

  if (!wallet) return wallet;

  wallet.set({
    wallet_type: walletData.wallet_type,
    lower_threshold: walletData.lower_threshold,
    upper_threshold: walletData.upper_threshold,
  });
  const updatedWallet = await wallet.save();

  return updatedWallet;
};