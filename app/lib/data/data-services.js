import { createClient } from "../supabase/server";

export async function getLists() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { data: lists, error } = await supabase
    .from('user_lists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error('Could not fetch lists')

  return lists
}


export async function  getUser(){
  // Fetch user profile
      const { data: user, error: profileError } = await supabase
        .from("users_info")
        .select("*")
        .eq("id", id)
        .single();

         if (error) throw new Error('Could not fetch user')

  return user

}

export async function getSurveys() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const { data: lists, error } = await supabase
    .from('onboarding_surveys')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error('Could not fetch surveys')

  return lists
}