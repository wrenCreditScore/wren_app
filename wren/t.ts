// // Helper functions
// function applyCap(score, cap) {
//     return Math.min(score, cap);
// }

// function applyPenalties(score, penalties) {
//     return Math.max(0, score - penalties.reduce((total, penalty) => total + penalty, 0));
// }

// export async function calculateCreditScore(walletData, transaction) {
//     // Define weights for each factor
//     const W1 = 0.20; // Weight for Asset Holdings
//     const W2 = 0.15; // Weight for Loan Repayment
//     const W3 = 0.15; // Weight for Account Duration
//     const W4 = 0.15; // Weight for Token Diversity
//     const W5 = 0.15; // Weight for Platform Activity
//     const W6 = 0.05; // Weight for Rewards
//     const W7 = 0.15; // Weight for Transaction History

//     // Calculate scores for each factor
//     console.log('\n-----------------------------------------');
//     const assetHoldingScore = await calculateAssetHoldingScore(walletData);
//     console.log('-----------------------------------------');
//     const loanRepaymentScore = await calculateLoanRepaymentScore(walletData);
//     console.log('-----------------------------------------');
//     const durationScore = await calculateDurationScore(walletData);
//     console.log('-----------------------------------------');
//     const tokenDiversityScore = await calculateTokenDiversityScore(walletData);
//     console.log('-----------------------------------------');
//     const platformActivityScore = await calculatePlatformActivityScore(walletData);
//     console.log('-----------------------------------------');
//     const rewardsScore = await calculateRewardsScore(walletData);
//     console.log('-----------------------------------------');
//     const transactionHistoryScore = await calculateTransactionHistoryScore(transaction);

//     // Apply penalties
//     const penalties = [];
//     if (rewardsScore === 0) penalties.push(50);
//     if (loanRepaymentScore === 0) penalties.push(30);
//     if (platformActivityScore < 20) penalties.push(20);

//     const totalScore = applyPenalties(
//         W1 * assetHoldingScore +
//         W2 * loanRepaymentScore +
//         W3 * durationScore +
//         W4 * tokenDiversityScore +
//         W5 * platformActivityScore +
//         W6 * rewardsScore +
//         W7 * transactionHistoryScore,
//         penalties
//     );

//     console.log('Total score after penalties: ', totalScore);

//     // Convert the total score to the 300-850 scale
//     const creditScore = Math.round(300 + (totalScore / 100) * 550);

//     // Ensure the credit score is within the valid range
//     const finalCreditScore = Math.max(300, Math.min(creditScore, 850));

//     console.log(`Final Credit Score: ${finalCreditScore}`);

//     return finalCreditScore;
// }

// export async function calculateTransactionHistoryScore(transactions) {
//     if (!Array.isArray(transactions) || transactions.length === 0) {
//         console.warn('Invalid transaction data provided');
//         return 0;
//     }

//     let score = 0;
//     const programInteractions = new Set();
//     const uniqueAccounts = new Set();
//     let totalSolTransferred = 0;
//     let tokenTransferCount = 0;
//     let nftActivityCount = 0;
//     const transactionDates = new Set();

//     for (const tx of transactions) {
//         const txDate = new Date(tx.timestamp * 1000).toDateString();
//         transactionDates.add(txDate);

//         for (const instruction of tx.instructions) {
//             programInteractions.add(instruction.programId);
//         }

//         for (const account of tx.accountData) {
//             uniqueAccounts.add(account.account);
//         }

//         totalSolTransferred += tx.nativeTransfers.reduce((sum, transfer) => sum + transfer.amount, 0) / 1e9;
//         tokenTransferCount += tx.tokenTransfers.length;

//         if (tx.type === 'COMPRESSED_NFT_MINT' || tx.description.includes('NFT')) {
//             nftActivityCount++;
//         }
//     }

//     const transactionCount = transactions.length;
//     const daysActive = transactionDates.size;

//     // Adjusted scoring based on transaction count
//     if (transactionCount < 10) {
//         score += transactionCount * 5; // 5 points per transaction for the first 10
//     } else if (transactionCount < 50) {
//         score += 50 + (transactionCount - 10) * 2; // 2 points per transaction from 11 to 50
//     } else {
//         score += 130 + Math.min(transactionCount - 50, 70); // 1 point per transaction above 50, max 70 additional points
//     }

//     score += Math.min(daysActive * 2, 100); // Up to 100 points for consistent activity
//     score += Math.min(programInteractions.size * 10, 200); // Up to 200 points for diverse program interactions
//     score += Math.min(uniqueAccounts.size, 100); // Up to 100 points for interacting with many accounts
//     score += Math.min(totalSolTransferred * 10, 100); // Up to 100 points for total SOL transferred
//     score += Math.min(tokenTransferCount * 2, 50); // Up to 50 points for token transfer activity
//     score += Math.min(nftActivityCount * 5, 50); // Up to 50 points for NFT activity

//     const finalScore = Math.min(Math.round(score), 1000);
//     console.log(`Transaction History Score: ${finalScore}`);

//     return finalScore;
// }

// export function calculateAssetHoldingScore(walletData) {
//     if (!Array.isArray(walletData) || walletData.length === 0) {
//         console.warn('Invalid wallet data provided: expected non-empty array');
//         return 0;
//     }

//     const wallet = walletData[0];
//     let score = 0;

//     // Process NFTs
//     const nftsElement = wallet.elements.find(e => e.platformId === 'wallet-nfts');
//     if (nftsElement && nftsElement.data && Array.isArray(nftsElement.data.assets)) {
//         const nftCount = nftsElement.data.assets.length;
//         const nftScore = Math.min(nftCount * 5, 50);
//         score += nftScore;
//         console.log(`NFT Score: ${nftScore} (${nftCount} NFTs)`);
//     }

//     // Process Tokens
//     const tokensElements = wallet.elements.filter(e => e.platformId === 'wallet-tokens');
//     let totalTokenValue = 0;
//     tokensElements.forEach(element => {
//         if (typeof element.value === 'number') {
//             totalTokenValue += element.value;
//         }
//     });
//     const tokenScore = Math.min(totalTokenValue * 10, 50);
//     score += tokenScore;
//     console.log(`Token Score: ${tokenScore} (Total Token value: ${totalTokenValue})`);

//     const finalScore = Math.min(score, 100);
//     console.log(`Final Asset Holding Score: ${finalScore}`);

//     return finalScore;
// }

// export function calculateLoanRepaymentScore(walletData) {
//     if (!Array.isArray(walletData) || walletData.length === 0) {
//         console.warn('Invalid wallet data provided: expected non-empty array');
//         return 0;
//     }

//     const wallet = walletData[0];
//     const lendingActivities = wallet.elements.filter(e => e.type === 'borrowlend');
   
//     if (lendingActivities.length === 0) {
//         console.log('No lending activities found');
//         return 0;
//     }

//     let score = 0;
//     lendingActivities.forEach(activity => {
//         if (activity.data && typeof activity.data.healthRatio === 'number') {
//             const healthRatio = activity.data.healthRatio;
//             if (healthRatio > 0.8) score += 50;
//             else if (healthRatio > 0.5) score += 30;
//             else score += 10;
//         }

//         if (activity.data && typeof activity.data.suppliedValue === 'number' && activity.data.suppliedValue > 0) {
//             score += 20;
//         }
//     });

//     const finalScore = Math.min(score, 100);
//     console.log(`Final Loan Repayment Score: ${finalScore}`);

//     return finalScore;
// }

// export function calculateDurationScore(walletData) {
//     if (!Array.isArray(walletData) || walletData.length === 0 || typeof walletData[0].date !== 'number') {
//         console.warn('Invalid wallet data structure or missing date');
//         return 0;
//     }

//     const lastActivity = new Date(walletData[0].date);
//     const now = new Date();
//     const durationInDays = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    
//     let score;
//     if (durationInDays > 365) score = 100;
//     else if (durationInDays > 180) score = 75;
//     else if (durationInDays > 90) score = 50;
//     else if (durationInDays > 30) score = 25;
//     else score = 10;

//     console.log(`Account age: ${durationInDays.toFixed(2)} days`);
//     console.log(`Duration Score: ${score}`);

//     return score;
// }

// export function calculateTokenDiversityScore(walletData) {
//     if (!Array.isArray(walletData) || walletData.length === 0 || !Array.isArray(walletData[0].elements)) {
//         console.warn('Invalid wallet data structure');
//         return 0;
//     }

//     const walletTokens = walletData[0].elements.filter(e => e.platformId === 'wallet-tokens');
//     const uniqueTokens = new Set();

//     walletTokens.forEach(element => {
//         if (element.data && Array.isArray(element.data.assets)) {
//             element.data.assets.forEach(asset => {
//                 if (asset.data && asset.data.address) {
//                     uniqueTokens.add(asset.data.address);
//                 }
//             });
//         }
//     });

//     const score = Math.min(uniqueTokens.size * 5, 100);
//     console.log(`Unique tokens found: ${uniqueTokens.size}`);
//     console.log(`Token Diversity Score: ${score}`);

//     return score;
// }

// export function calculatePlatformActivityScore(walletData) {
//     if (!Array.isArray(walletData) || walletData.length === 0 || !Array.isArray(walletData[0].fetcherReports)) {
//         console.warn('Invalid or missing fetcherReports in wallet data');
//         return 0;
//     }

//     const platforms = new Set(
//         walletData[0].fetcherReports
//             .filter(report => report && typeof report.id === 'string')
//             .map(report => report.id.split('-')[0])
//             .filter(Boolean)
//     );

//     const score = Math.min(platforms.size * 10, 100);
//     console.log(`Unique platforms found: ${platforms.size}`);
//     console.log(`Platform Activity Score: ${score}`);

//     return score;
// }

// export function calculateRewardsScore(walletData) {
//     if (!Array.isArray(walletData) || walletData.length === 0 || !Array.isArray(walletData[0].elements)) {
//         console.warn('Invalid wallet data structure');
//         return 0;
//     }

//     const rewardsElement = walletData[0].elements.find(e => e.platformId === 'save' && e.label === 'Rewards');
    
//     if (!rewardsElement || typeof rewardsElement.value !== 'number') {
//         console.log('No valid rewards element found');
//         return 0;
//     }

//     const rewardsValue = rewardsElement.value;
//     const score = Math.min(rewardsValue * 100, 100);
    
//     console.log(`Rewards value: ${rewardsValue}`);
//     console.log(`Rewards Score: ${score}`);

//     return score;
// }