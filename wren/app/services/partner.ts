import {storePartner, getPartnerByNumber} from '../repositories/partner_repo';

import CryptoJS from 'crypto-js';
import { createPartnerSchema } from "../repositories/schemas/partner_sch";

const pToken = process.env.PARTNER_TOKEN;

export async function createPartner(body) {

    const { name, phone_number } = body;

    if (!name || !phone_number) {
        return { success: false, message: 'Name and phone number are required' };
    }
    
    const token = await CryptoJS.AES.encrypt(phone_number, pToken).toString();

    const parseData = await createPartnerSchema.parse({
        name,
        phone_number,
        access_token: token
    });

    await storePartner(parseData);

    return { success: true, message: 'The token will only be shown to you once. Please keep it safe.', token: token};

}

export async function getCreditScoreByCID(cid) {
   // const user = await getCreditScoreByUserId(cid);
}

export async function getPartnerByPhoneNumber(phone_number) {

    const partner = await getPartnerByNumber(phone_number);
    return partner;
}

function generateAccessToken(data){
// decrypt the ciphertext using AES decryption
// const bytes = CryptoJS.AES.decrypt(ciphertext, password);
// const plaintext = bytes.toString(CryptoJS.enc.Utf8);
// console.log(plaintext);
}

