import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { Suspense } from "react";
import UserListPage from "./ListPageClient";

async function page({params}) {
     const { id, listid } = await params;

     
    //   // Fetch user
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users_info") // adjust to your user table name
        .select("*")
        .eq("id", id)
        .single();

if (userError) console.error(userError);
    // Fetch list info
      const { data: listData, error: listError } = await supabaseAdmin
        .from("user_lists")
        .select("*")
        .eq("id", listid)
        .single();

      if (listError) console.error(listError);

      // Fetch items in this list
      const { data: itemsData, error: itemsError } = await supabaseAdmin
        .from("list_items")
        .select("*")
        .eq("list_id", listid);
        if (itemsError) console.error(itemsError);

    return (
        <div className="mt-10  w-full">
            <Suspense>
                <UserListPage listData={listData}
                itemsData={itemsData}
                userData={userData}
                />
            </Suspense>
        </div>
    )
}

export default page
