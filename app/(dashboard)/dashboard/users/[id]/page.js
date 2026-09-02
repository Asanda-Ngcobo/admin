import UserPageClient from "./UserPageClient";
import { Suspense } from "react";
import Loading from "../../loading";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

async function userPage({ params }) {
  const { id } = await params;

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

  // Fetch items for all of the user's lists
  const listIds = userLists?.map((list) => list.id) ?? [];

  let itemsData = [];
  if (listIds.length > 0) {
    const { data, error: itemsError } = await supabaseAdmin
      .from("list_items")
      .select("*")
      .in("list_id", listIds);

    if (itemsError) console.error(itemsError);
    itemsData = data ?? [];
  }

  return (
    <div className="mt-10 w-full">
      <Suspense fallback={<Loading />}>
        <UserPageClient
          profile={profile}
          userLists={userLists}
          listItems={itemsData}
        />
      </Suspense>
    </div>
  );
}

export default userPage;
