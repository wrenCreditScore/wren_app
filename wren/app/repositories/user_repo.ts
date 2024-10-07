import { createSupabaseClient } from "../utils/supabase";
const supabase = createSupabaseClient();

export async function storeUser(data) {
    const { data: insertedData, error } = await supabase.from('users').insert(data).select();
    if (error) {
        console.error('Error storing user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: insertedData };
}

export async function getUserByID(id) {

    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

export async function getUserByCID(cid) {

    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('CID', cid)
        .single();
    if (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

export async function updateUser(data) {
    const { data: updatedData, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', data.id);
    
    if (error) {
        console.error('Error updating user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: updatedData };
}

export async function getUserByIDNumberCIN(value) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .or(`id.eq.${value},phone_number.eq.${value},CIN.eq.${value}`)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

export async function getUserByMobileOrEmail(value){
    const { data, error } = await supabase
        .from('users')
        .select()
        .or(`phone_number.eq.${value},email.eq.${value}`)
        .single();
    if (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}