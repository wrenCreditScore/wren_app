import * as walletService from '../services/wallet_service';

export async function getWallets(req, res) {
    const user = req.user;

    try {
        const wallets = await walletService.getAllWalletsByUserId(user.id);
        res.status(200).json(wallets.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function addWallet(req, res) {
    const user = req.user;
    const body = req.body;

    try {
        const wallet = await walletService.storeWallets(user.id, body);
        res.status(200).json(wallet.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

export async function updateWallet(req, res) {
    const user = req.user;
    const body = req.body;
    const id = req.params.id;

    try {
        const wallet = await walletService.updateWallet(id, body);
        res.status(200).json(wallet.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

export async function removeWallet(req, res) {
    const user = req.user;
    const id = req.params.id;

    try {
        const wallet = await walletService.deleteWallet(id);
        res.status(200).json({ message: 'Wallet deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
}