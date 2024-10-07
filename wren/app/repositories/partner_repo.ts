import { createSupabaseClient } from "../utils/supabase";
const supabase = createSupabaseClient();

export async function storePartner(data) {
    const { data: insertedData, error } = await supabase.from('partners').insert(data).select();
    if (error) {
        console.error('Error storing partner:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: insertedData };
}

export async function getPartnerByNumber(phone_number) {
    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('phone_number', phone_number)
        .single();
        
    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching partner:', error);
        return { data: null, error };
    }

    return { data, error: null };
}