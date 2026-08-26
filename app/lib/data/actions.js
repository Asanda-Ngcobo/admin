
'use server'


import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../supabase/admin'
import { createClient } from '../supabase/server'
import { generatePassword } from '../utils/generatePassword'




// export async function inviteAdmin(email) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers({
//     page: 1,
//     perPage: 100
//   })
//   if (listError) throw listError

//   const adminExists = data?.users.some(
//     u => u.user_metadata?.role === 'admin'
//   )

//   // If any admin exists, the caller must themselves be an admin
//   if (adminExists && user?.user_metadata?.role !== 'admin') {
//     throw new Error('Unauthorized')
//   }

//   const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
//      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/accept-invite`,
//     data: {
//       role: 'admin',
//       force_password_reset: true
//     }
//   })

//   if (error) throw error
// }

// actions.js


export async function inviteAdmin(email) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
  const adminExists = users.some(u => u.app_metadata?.role === 'admin')

  if (adminExists && user?.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const password = generatePassword()


  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    app_metadata: { role: 'admin' },
    email_confirm: true  // skip email confirmation
  })

  if (error) throw error

  // return password so you can display/email it to the inviter
  return { email, password }
}
export async function addBlog({ title, body, seo_title, type, seo_description, cta, image_url }) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("User not authenticated");
  if (user.app_metadata?.role !== "admin") throw new Error("Unauthorized");

  if (typeof title !== "string" || typeof body !== "string") {
    throw new Error("Invalid form data");
  }

  if (!title.trim() || !body.trim()) {
    throw new Error("Title and body cannot be empty");
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  const { error } = await supabaseAdmin.from("blogs").insert([{
    title,
    body,
    seo_title,
    seo_description,
    slug: generateSlug(title),
    cta,
    type,
    image_url,
  }]);

  if (error) {
    console.error("Supabase addBlog error:", error.message);
    throw new Error("The blog could not be added");
  }

  redirect("/dashboard/blog-post/success")
}