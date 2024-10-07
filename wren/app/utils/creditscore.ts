
function applyCap(score, cap) {
    return Math.min(score, cap);
}

function applyPenalties(score, penalties) {
    return Math.max(300, score - penalties.reduce((total, penalty) => total + penalty, 0));
}

const CAPS = {
    ASSET_HOLDING: 110,       // Max contribution of 110 points
    LOAN_REPAYMENT: 110,      // Max contribution of 110 points
    DURATION: 110,            // Max contribution of 110 points
    TOKEN_DIVERSITY: 110,     // Max contribution of 110 points
    PLATFORM_ACTIVITY: 110,   // Max contribution of 110 points
    REWARDS: 55,              // Max contribution of 55 points
    TRANSACTION_HISTORY: 110  // Max contribution of 110 points
};

export async function calculateTransactionHistoryScore(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) {
        console.warn('Invalid transaction data provided');
        return 0;
    }

    let score = 0;
    const programInteractions = new Set();
    const uniqueAccounts = new Set();
    let totalSolTransferred = 0;
    let tokenTransferCount = 0;
    let nftActivityCount = 0;
    const transactionDates = new Set();

    for (const tx of transactions) {
        const txDate = new Date(tx.timestamp * 1000).toDateString();
        transactionDates.add(txDate);

        for (const instruction of tx.instructions) {
            programInteractions.add(instruction.programId);
        }

        for (const account of tx.accountData) {
            uniqueAccounts.add(account.account);
        }

        totalSolTransferred += tx.nativeTransfers.reduce((sum, transfer) => sum + transfer.amount, 0) / 1e9;
        tokenTransferCount += tx.tokenTransfers.length;

        if (tx.type === 'COMPRESSED_NFT_MINT' || tx.description.includes('NFT')) {
            nftActivityCount++;
        }
    }

    const transactionCount = transactions.length;
    const daysActive = transactionDates.size;

    // Adjusted scoring based on transaction count
    if (transactionCount < 10) {
        score += transactionCount * 2; // 2 points per transaction for the first 10
    } else if (transactionCount < 50) {
        score += 20 + (transactionCount - 10); // 1 point per transaction from 11 to 50
    } else {
        score += 60 + Math.min(transactionCount - 50, 20); // 0.5 points per transaction above 50, max 20 additional points
    }

    score += Math.min(daysActive, 20); // Up to 20 points for consistent activity
    score += Math.min(programInteractions.size * 2, 20); // Up to 20 points for diverse program interactions
    score += Math.min(uniqueAccounts.size * 0.5, 20); // Up to 20 points for interacting with many accounts
    score += Math.min(totalSolTransferred * 2, 20); // Up to 20 points for total SOL transferred
    score += Math.min(tokenTransferCount * 0.5, 20); // Up to 20 points for token transfer activity
    score += Math.min(nftActivityCount, 10); // Up to 10 points for NFT activity

    const finalScore = applyCap(Math.round(score), CAPS.TRANSACTION_HISTORY);
    console.log(`Transaction History Score: ${finalScore}`);

    return finalScore;
}

export function calculateAssetHoldingScore(walletData) {
    if (!Array.isArray(walletData) || walletData.length === 0) {
        console.warn('Invalid wallet data provided: expected non-empty array');
        return 0;
    }

    const wallet = walletData[0];
    let score = 0;

    // Process NFTs
    const nftsElement = wallet.elements.find(e => e.platformId === 'wallet-nfts');
    if (nftsElement && nftsElement.data && Array.isArray(nftsElement.data.assets)) {
        const nftCount = nftsElement.data.assets.length;
        const nftScore = Math.min(nftCount, 55);
        score += nftScore;
        console.log(`NFT Score: ${nftScore} (${nftCount} NFTs)`);
    }

    // Process Tokens
    const tokensElements = wallet.elements.filter(e => e.platformId === 'wallet-tokens');
    let totalTokenValue = 0;
    tokensElements.forEach(element => {
        if (typeof element.value === 'number') {
            totalTokenValue += element.value;
        }
    });
    const tokenScore = Math.min(totalTokenValue * 2, 55);
    score += tokenScore;
    console.log(`Token Score: ${tokenScore} (Total Token value: ${totalTokenValue})`);

    const finalScore = applyCap(score, CAPS.ASSET_HOLDING);
    console.log(`Final Asset Holding Score: ${finalScore}`);

    return finalScore;
}

export function calculateLoanRepaymentScore(walletData) {
    if (!Array.isArray(walletData) || walletData.length === 0) {
        console.warn('Invalid wallet data provided: expected non-empty array');
        return 0;
    }

    const wallet = walletData[0];
    const lendingActivities = wallet.elements.filter(e => e.type === 'borrowlend');
   
    if (lendingActivities.length === 0) {
        console.log('No lending activities found');
        return 0;
    }

    let score = 0;
    lendingActivities.forEach(activity => {
        if (activity.data && typeof activity.data.healthRatio === 'number') {
            const healthRatio = activity.data.healthRatio;
            if (healthRatio > 0.8) score += 55;
            else if (healthRatio > 0.5) score += 35;
            else score += 15;
        }

        if (activity.data && typeof activity.data.suppliedValue === 'number' && activity.data.suppliedValue > 0) {
            score += 20;
        }
    });

    const finalScore = applyCap(score, CAPS.LOAN_REPAYMENT);
    console.log(`Final Loan Repayment Score: ${finalScore}`);

    return finalScore;
}

export function calculateDurationScore(walletData) {
    if (!Array.isArray(walletData) || walletData.length === 0 || typeof walletData[0].date !== 'number') {
        console.warn('Invalid wallet data structure or missing date');
        return 0;
    }

    const lastActivity = new Date(walletData[0].date);
    const now = new Date();
    const durationInDays = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    
    let score;
    if (durationInDays > 365) score = 110;
    else if (durationInDays > 180) score = 80;
    else if (durationInDays > 90) score = 55;
    else if (durationInDays > 30) score = 30;
    else score = 10;

    console.log(`Account age: ${durationInDays.toFixed(2)} days`);
    const finalScore = applyCap(score, CAPS.DURATION);
    console.log(`Duration Score: ${finalScore}`);

    return finalScore;
}

export function calculateTokenDiversityScore(walletData) {
    if (!Array.isArray(walletData) || walletData.length === 0 || !Array.isArray(walletData[0].elements)) {
        console.warn('Invalid wallet data structure');
        return 0;
    }

    const walletTokens = walletData[0].elements.filter(e => e.platformId === 'wallet-tokens');
    const uniqueTokens = new Set();

    walletTokens.forEach(element => {
        if (element.data && Array.isArray(element.data.assets)) {
            element.data.assets.forEach(asset => {
                if (asset.data && asset.data.address) {
                    uniqueTokens.add(asset.data.address);
                }
            });
        }
    });

    const score = Math.min(uniqueTokens.size * 2, 110);
    console.log(`Unique tokens found: ${uniqueTokens.size}`);
    const finalScore = applyCap(score, CAPS.TOKEN_DIVERSITY);
    console.log(`Token Diversity Score: ${finalScore}`);

    return finalScore;
}

export function calculatePlatformActivityScore(walletData) {
    if (!Array.isArray(walletData) || walletData.length === 0 || !Array.isArray(walletData[0].fetcherReports)) {
        console.warn('Invalid or missing fetcherReports in wallet data');
        return 0;
    }

    const platforms = new Set(
        walletData[0].fetcherReports
            .filter(report => report && typeof report.id === 'string')
            .map(report => report.id.split('-')[0])
            .filter(Boolean)
    );

    const score = Math.min(platforms.size * 5, 110);
    console.log(`Unique platforms found: ${platforms.size}`);
    const finalScore = applyCap(score, CAPS.PLATFORM_ACTIVITY);
    console.log(`Platform Activity Score: ${finalScore}`);

    return finalScore;
}

export function calculateRewardsScore(walletData) {
    if (!Array.isArray(walletData) || walletData.length === 0 || !Array.isArray(walletData[0].elements)) {
        console.warn('Invalid wallet data structure');
        return 0;
    }

    const rewardsElement = walletData[0].elements.find(e => e.platformId === 'save' && e.label === 'Rewards');
    
    if (!rewardsElement || typeof rewardsElement.value !== 'number') {
        console.log('No valid rewards element found');
        return 0;
    }

    const rewardsValue = rewardsElement.value;
    const score = Math.min(rewardsValue * 50, 55);
    
    console.log(`Rewards value: ${rewardsValue}`);
    const finalScore = applyCap(score, CAPS.REWARDS);
    console.log(`Rewards Score: ${finalScore}`);

    return finalScore;
}
