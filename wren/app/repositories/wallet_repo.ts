import { createSupabaseClient } from "../utils/supabase";
const supabase = createSupabaseClient();

export async function storeWallets(data) {
    const { data: insertedData, error } = await supabase
        .from('wallets')
        .insert(data)
        .select();

    if (error) {
        console.error('Error storing wallets:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: insertedData };
}

export async function getWalletByID(id) {
    const { data, error } = await supabase
        .from('wallets')
        .select()
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error fetching wallet:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

export async function getAllWalletsByUserId(id) {
    const { data, error } = await supabase
        .from('wallets')
        .select()
        .eq('user_id', id);
    if (error) {
        console.error('Error fetching wallets:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

export async function getByUserId(id) {
    const { data, error } = await supabase
        .from('wallets')
        .select()
        .eq('user_id', id)
        .single();
    if (error) {
        console.error('Error fetching wallet:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

export async function updateWallet(data) {
    const { data: updatedData, error } = await supabase
        .from('wallets')
        .update(data)
        .eq('id', data.id)
        .select();
    
    if (error) {
        console.error('Error updating wallet:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: updatedData };
}

export async function deleteWallet(id) {
    const { data, error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting wallet:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}