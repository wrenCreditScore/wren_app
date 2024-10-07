import { 
    calculateAssetHoldingScore, 
    calculateLoanRepaymentScore, 
    calculateDurationScore, 
    calculateTokenDiversityScore, 
    calculatePlatformActivityScore, 
    calculateRewardsScore,
    calculateTransactionHistoryScore
} from '../utils/creditscore'

import {storeCredit,updateCredit,  getCreditByUserIDAndWalletId, getCreditScoreByUserId} from '../repositories/credit_score_repo'

function applyPenalties(score, penalties) {
  return Math.max(300, score - penalties.reduce((total, penalty) => total + penalty, 0));
}

export async function calculateCreditScore(walletData, transaction, wallet, offRamp) {

    // Calculate scores for each factor
    console.log('\n-----------------------------------------');
    const assetHoldingScore = await calculateAssetHoldingScore(walletData);
    console.log('-----------------------------------------');
    const loanRepaymentScore = await calculateLoanRepaymentScore(walletData);
    console.log('-----------------------------------------');
    const durationScore = await calculateDurationScore(walletData);
    console.log('-----------------------------------------');
    const tokenDiversityScore = await calculateTokenDiversityScore(walletData);
    console.log('-----------------------------------------');
    const platformActivityScore = await calculatePlatformActivityScore(walletData);
    console.log('-----------------------------------------');
    const rewardsScore = await calculateRewardsScore(walletData);
    console.log('-----------------------------------------');
    const transactionHistoryScore = await calculateTransactionHistoryScore(transaction);
  
    // If offRamp data exists, calculate the average score with offRamp data
    let finalTransactionHistoryScore = transactionHistoryScore;
    let finalRewardScore = rewardsScore;
    let finalLoanRepaymentScore = loanRepaymentScore;
  
    if (offRamp) {
      console.log('Including offRamp data in the score calculation');
      
      // Calculate the average of the existing score and the offRamp score
      if (offRamp.transaction_history_score) {
        finalTransactionHistoryScore = (transactionHistoryScore + offRamp.transaction_history_score) / 2;
      }
      if (offRamp.reward_score) {
        finalRewardScore = (rewardsScore + offRamp.reward_score) / 2;
      }
      if (offRamp.loan_repayment_score) {
        finalLoanRepaymentScore = (loanRepaymentScore + offRamp.loan_repayment_score) / 2;
      }
    }
  
    // Sum up all scores
    let totalScore = 300 + // Base score
      assetHoldingScore +
      finalLoanRepaymentScore +
      durationScore +
      tokenDiversityScore +
      platformActivityScore +
      finalRewardScore +
      finalTransactionHistoryScore;
  
    // Apply penalties only for missing information
    const penalties = [];
    if (finalRewardScore === 0 && walletData[0].elements.find(e => e.platformId === 'save' && e.label === 'Rewards') === undefined) {
      penalties.push(50);
      console.log("Penalty applied: No rewards information available");
    }
    if (finalLoanRepaymentScore === 0 && walletData[0].elements.filter(e => e.type === 'borrowlend').length === 0) {
      penalties.push(30);
      console.log("Penalty applied: No loan repayment information available");
    }
    if (platformActivityScore === 0 && (!Array.isArray(walletData[0].fetcherReports) || walletData[0].fetcherReports.length === 0)) {
      penalties.push(20);
      console.log("Penalty applied: No platform activity information available");
    }
  
    console.log('Total score before penalties: ', totalScore);
  
    totalScore = applyPenalties(totalScore, penalties);
  
    console.log('Total score after penalties: ', totalScore);
  
    // Ensure the credit score is within the valid range
    const finalCreditScore = Math.min(Math.max(totalScore, 300), 850);
  
    console.log(`Final Credit Score: ${finalCreditScore}`);
  
    // Store the combined scores
    await createScore({
      asset_holding_score: assetHoldingScore,
      loan_repayment_score: finalLoanRepaymentScore,
      duration_score: durationScore,
      token_diversity_score: tokenDiversityScore,
      platform_activity_score: platformActivityScore,
      rewards_score: finalRewardScore,
      transaction_history_score: finalTransactionHistoryScore,
      credit_score: finalCreditScore
    }, wallet);
  
    return finalCreditScore;
  }
  

export async function createScore(scores, wallet){

    const { data: existingRecord, error: fetchError } = await getCreditByUserIDAndWalletId(wallet.user_id, wallet.id);

    if (fetchError) {
        console.error('Error fetching existing record:', fetchError);
        return { success: false, error: fetchError.message };
    }

    const creditData = {
        user_id: wallet.user_id,
        wallet_id: wallet.id,
        asset_holding: scores.asset_holding_score,
        loan_repayment_score: scores.loan_repayment_score,
        duration_score: scores.duration_score,
        token_diversity: scores.token_diversity_score,
        activity_score: scores.platform_activity_score,
        reward_score: scores.rewards_score,
        transaction_score: scores.transaction_history_score,
        score: scores.credit_score,
    };

    if (existingRecord) {
        return await updateCredit(creditData);
    } else {
        return await storeCredit(creditData);
    }
}

export async function getCreditScore(user) {
    const { data, error } = await getCreditScoreByUserId(user.id);

    if (error || !data) {
        return { error: 'Unable to fetch credit score' };
    }

    // Initialize sums for each field
    let sumFields = {
        asset_holding: 0,
        duration_score: 0,
        token_diversity: 0,
        activity_score: 0,
        reward_score: 0,
        transaction_score: 0,
        loan_repayment_score: 0,
        score: 0
    };

    // Loop through the data to calculate sums
    for (const score of data) {
        sumFields.asset_holding += score.asset_holding;
        sumFields.duration_score += score.duration_score;
        sumFields.token_diversity += score.token_diversity;
        sumFields.activity_score += score.activity_score;
        sumFields.reward_score += score.reward_score;
        sumFields.transaction_score += score.transaction_score;
        sumFields.loan_repayment_score += score.loan_repayment_score;
        sumFields.score += score.score; // Summing the scores
    }

    // Calculate the average score
    const averageScore = sumFields.score / data.length;

    // Function to get the credit score remark
    const getCreditScoreRemark = (score) => {
        if (score >= 800) return 'Excellent';
        if (score >= 740) return 'Very Good';
        if (score >= 670) return 'Good';
        if (score >= 580) return 'Fair';
        return 'Poor';
    };

    // Return the sum of the fields and the average score
    return {
        asset_holding: Math.round(sumFields.asset_holding),
        duration_score: Math.round(sumFields.duration_score),
        token_diversity: Math.round(sumFields.token_diversity),
        activity_score: Math.round(sumFields.activity_score),
        reward_score: Math.round(sumFields.reward_score),
        transaction_score: Math.round(sumFields.transaction_score),
        loan_repayment_score: Math.round(sumFields.loan_repayment_score),
        average_score: parseFloat(averageScore.toFixed(2)),
        credit_score_remark: getCreditScoreRemark(Math.round(averageScore))
    };
}