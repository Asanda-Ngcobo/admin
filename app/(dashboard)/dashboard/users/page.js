

import UsersWrapper from "@/app/_comps/UsersWrapper";
import { getLists, getSummaries } from "@/app/lib/data/data-services";
import { supabaseAdmin } from "@/app/lib/supabase/admin"
import { Suspense } from "react";
import Loading from "../loading";



async function page() {
     const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100
    })
  const lists = await getLists();

    const nonAdminUsers = users.filter(u => u.app_metadata?.role !== 'admin')
    // console.log(nonAdminUsers)

    return (
        <div className="mt-10  w-full">
          <Suspense fallback={<Loading/>}>
              <UsersWrapper
             users={nonAdminUsers}
         lists={lists}/>
         

          </Suspense>
        
            
        </div>
    )
}

export default page
