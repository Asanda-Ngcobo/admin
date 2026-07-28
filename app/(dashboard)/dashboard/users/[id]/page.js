
import UserPageClient from "./UserPageClient";
import { Suspense } from "react";
import Loading from "../../loading";
import { supabaseAdmin } from "@/app/lib/supabase/admin";


async function userPage({params}) {
    
     const { id } = await params; 
//   const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({
//       page: 1,
//       perPage: 100
//     })

//     const nonAdminUsers = users.filter(u => u.app_metadata?.role !== 'admin')
//     // console.log(nonAdminUsers)
//   const lists = await getLists();

   // Fetch user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("users_info")
        .select("*")
        .eq("id", id)
        .single();

       
         // Fetch their lists
      const { data: userLists, error: listError } = await supabaseAdmin
        .from("user_lists")
        .select("*")
        .eq("user_id", id)
         .order("created_at", { ascending: false });

    return (
        <div className="mt-10  w-full">
             <Suspense fallback={<Loading/>}>
             <UserPageClient profile={profile}
             userLists={userLists}/>
         

          </Suspense>
        </div>
    )
}

export default userPage
