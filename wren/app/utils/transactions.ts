import axios from "axios";
const helius_api = process.env.HELIUS_API_KEY;

export async function getTransactions(address){
    const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${helius_api}`;
  
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      
      throw error; // Optional: Rethrow if you need further error handling upstream
    }
  
  }

  export async function fetchOffRampData(user){
    const url =`https://66f52d709aa4891f2a242b2c.mockapi.io/api/v1/Activities`
  

    try {

      const response = await axios.get(url);

      const result = response.data.find((item) => item.CID === user.CIN);

      return result;

    }catch (error) {
      
      throw error; // Optional: Rethrow if you need further error handling upstream
    }
  }