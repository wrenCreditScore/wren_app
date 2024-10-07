import { createSupabaseClient } from "../utils/supabase";
const supabase = createSupabaseClient();

export async function storeCredit(data) {
    const { data: insertedData, error } = await supabase.from('creditScores').insert(data);
    if (error) {
        console.error('Error storing user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: insertedData };
}

export async function updateCredit(data) {
    const { data: updatedData, error } = await supabase
        .from('creditScores')
        .update(data)
        .eq('user_id', data.user_id)
        .eq('wallet_id', data.wallet_id);
    if (error) {
        console.error('Error updating credit score:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: updatedData };
}

export async function getCreditByUserIDAndWalletId(user_id, wallet_id) {
    const { data, error } = await supabase
        .from('creditScores')
        .select()
        .eq('user_id', user_id)
        .eq('wallet_id', wallet_id)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credit score:', error);
        return { data: null, error };
    }
    return { data, error: null };
}

export async function getCreditScoreByUserId(id) {
    const { data, error } = await supabase
        .from('creditScores')
        .select()
        .eq('user_id', id)
    if (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}