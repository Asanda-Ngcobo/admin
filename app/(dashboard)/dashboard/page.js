

import ReportsWrapper from "@/app/_comps/ReportWrapper";
import { getLists } from "@/app/lib/data/data-services";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";


async function page() {

  const supabase = await createClient()
  const { data:  user  } = await supabase.auth.getUser()

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({
  page: 1,
  perPage: 100
})
const lists = await getLists()

const nonAdminUsers = users.filter(u => u.app_metadata?.role !== 'admin')
  

  return (
    //main Container
    <div className="mt-10  w-full">
      {/* Headings Container */}
      
         <ReportsWrapper 
         users={nonAdminUsers}
         lists={lists}/>
        {/* Numbers Container */}
    
    
      {/* Summaries overview container */}

     
    </div>
  );
}

export default page;
