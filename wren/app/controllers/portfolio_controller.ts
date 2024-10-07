import * as portfolioService from '../services/portfolio';
import * as tx from '../utils/transactions'
import {calculateCreditScore, getCreditScore} from '../services/credit_score_service'
import {getAllWalletsByUserId} from '../services/wallet_service'
export async function generateScore(req, res) {
    const user = req.user;  
    const { useCache, address, addressSystem } = req.query;
    
    try {

        const wallets =  await getAllWalletsByUserId(user.id);

        if(!wallets.data) return

        for(const wallet of wallets.data){
            //fetch transactions and portfolio based on the wallet.wallet_address
            const transaction = await tx.getTransactions(wallet.wallet_address)
            const txOffRamp = await tx.fetchOffRampData(user)

            const portfolio = await portfolioService.getPortfolio({
                useCache: 'false',
                address: wallet.wallet_address,
                addressSystem: addressSystem,
            })

            const cScore = await calculateCreditScore(portfolio, transaction, wallet, txOffRamp)
        }


        // const transaction = await tx.getTransactions(address)

        // const portfolio = await portfolioService.getPortfolio({
        //     useCache: 'false',
        //     address: address,
        //     addressSystem: addressSystem,
        // })
        // const cScore = await calculateCreditScore(portfolio, transaction)

        res.status(200).json({message: wallets})
        
    } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
        res.status(500).json({ error: 'An error occurred while fetching portfolio data' });
    }
}

export async function  getCreditScoreByUserId(req, res){
    const user = req.user;

    try {
        const creditScore = await getCreditScore(user)
        res.status(200).json(creditScore)
    } catch (err) {
        res.status(500).json({error: err})
    }
}

