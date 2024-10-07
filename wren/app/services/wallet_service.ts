import * as walletRepo from '../repositories/wallet_repo';

export async function storeWallets(userId, data) {

    //check if data is not empty
    if (!data) {
        throw new Error('wallet data cannot be empty');
    }
    // Ensure data is always an array
    const walletsData = Array.isArray(data) ? data : [data];

    // Add user_id to each wallet object
    const walletsWithUserId = walletsData.map(wallet => ({
        ...wallet,
        user_id: userId
    }));

    return await walletRepo.storeWallets(walletsWithUserId);
}

export async function getWalletByID(id) {
    return await walletRepo.getWalletByID(id);
}

export async function getAllWalletsByUserId(id) {
    return await walletRepo.getAllWalletsByUserId(id);
}

export async function getByUserId(id) {
    return await walletRepo.getByUserId(id);
}

export async function updateWallet(id, data) {
    data.id = id;
    return await walletRepo.updateWallet(data);
}

export async function deleteWallet(id) {
    return await walletRepo.deleteWallet(id);
}

