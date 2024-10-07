import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
const baseUrl = 'https://portfolio-api.sonar.watch/v1';
const apiKey = process.env.SONAR_TOKEN;
const helius_api = process.env.HELIUS_API_KEY;

export async function getPortfolio(params) {
    try {

        const res = await axios.get(`${baseUrl}/portfolio/fetch`, {
            params: params,
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });


        return [
            res.data,
        ]
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error('Error response:', error.response.data);
              console.error('Error status:', error.response.status);
            } else if (error.request) {
              console.error('No response received:', error.request);
            } else {
              console.error('Error setting up request:', error.message);
            }
          } else {
            console.error('Unexpected error:', error);
          }
          throw error;
    }
        
}




//getTransactions('EBi5YuiLW5qh8FxT3suR6LMYoYYTRSa3nT4jocyv2wcu')

// async function getAddressTransactions(address, limit = 10){

//   try {
//     const conn = new Connection(clusterApiUrl('devnet'));
//     const pubKey = new PublicKey(address);

//     const transactions = await conn.getSignaturesForAddress(pubKey, { limit: limit,  });

//     // conn.getTransactions()

//     transactions.forEach((transaction, i) => {
//       const date = new Date(transaction.blockTime*1000);
//       console.log(transaction)
//         console.log(`Transaction No: ${i+1}`);
//         console.log(`Signature: ${transaction.signature}`);
//         console.log(`Time: ${date}`);
//         console.log(`Status: ${transaction.confirmationStatus}`);
//         console.log(("-").repeat(20));
//     })

//   } catch (error) {
//     console.error('Error fetching Solana transactions:', error);
//     throw error;
//   }
// }


