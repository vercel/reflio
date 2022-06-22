import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getUser = async (token) => {
  let dataToReturn = null;

  const { data, error } = await supabaseAdmin.auth.api.getUser(token);

  if (error) {
    throw error;
  }

  if(data){
    dataToReturn = data;

    const userData = await supabaseAdmin.from('users').select('*').eq('id', data?.id).single();

    if(userData?.data?.team_id){
      dataToReturn.team_id = userData?.data?.team_id;
    }
  }

  return dataToReturn;
};