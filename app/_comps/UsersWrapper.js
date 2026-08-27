'use client'
import { DollarSign, FileText, User, UserPlus, Users } from "@deemlol/next-icons";
import { useMemo, useState } from "react";
import ReportDuration from "@/app/_comps/ReportDuration";
import Image from "next/image";
import Link from "next/link";
function UsersWrapper({users, lists}) {
     const [duration, setDuration] = useState(30);

    
      // ✅ Filter users
      const filteredUsers = useMemo(() => {
        if (duration === "all") return users;
        const cutoff = new Date(Date.now() - duration * 86400000);
        return users.filter(u => new Date(u.created_at) >= cutoff);
      }, [users, duration]);

      // ✅ Filter lists
      const filteredLists = useMemo(() => {
    if (duration === "all") return lists;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return lists.filter(s => new Date(s.created_at) >= cutoff);
  }, [lists, duration]);
      
        // ✅ Paid summaries + revenue
       const shoppedLists = filteredLists.filter(s => s.shopped_at !== null);
        const revenue = shoppedLists.reduce(
          (sum, s) => sum + Number(s.money_spent || 0),
          0
        );
      
        // ✅ User Spend
        const averageSpend =
          shoppedLists.length > 0
            ? revenue / filteredUsers.length
            : 0;

            // summary/user
            const listPerUser = 
            filteredLists.length > 0 
            ? filteredLists.length / filteredUsers.length
            : 0;

            const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(value || 0);

  const listsByUser = useMemo(() => {
  const map = {};

  lists.forEach((s) => {
    if (!s.user_id) return;

    if (!map[s.user_id]) {
      map[s.user_id] = {
        count: 0,
        totalSpend: 0,
      };
    }

    map[s.user_id].count += 1;

    if (s.money_spent !== null) {
      map[s.user_id].totalSpend += Number(s.money_spent || 0);
    }
  });

  return map;
}, [lists]);

    return (
 <div className="py-2 px-4 mt-2 lg:w-[96%] lg:mx-auto">
                 <div className="flex justify-between mx-5 my-4">
                      <div>
        <h1>Users</h1>
        <p>Here is your users analytics</p>
        </div> 
         <div>
  <ReportDuration onChange={setDuration} />
         </div>
           </div>
           <ul className="flex gap-4">
        {/* USERS */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <Users />
            <h1>All Users</h1>
          </div>
          <h1 className="text-4xl">{users.length}</h1>
        </li>

        {/* SUMMARIES */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <UserPlus />
            <h1>New Users</h1>
          </div>
          <h1 className="text-4xl">{filteredUsers.length} </h1>
        </li>

        {/* REVENUE */}
        {/*<li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <DollarSign />
            <h1>User Spend</h1>
          </div>
          <h1 className="text-4xl">
            R {averageSpend.toFixed(2)}
          </h1>
        </li>

     
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <FileText />
            <h1>Summary/User</h1>
          </div>
          <h1 className="text-4xl">
            {listPerUser}
          </h1>
        </li>*/}
      </ul>
      <div className="bg-white h-[55vh] w-full rounded-sm overflow-hidden mt-3">
<div className="h-full overflow-y-auto">
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 bg-(--accent-primary) text-white">
        <tr>
          <th className="px-4 py-3 text-left">Photo</th>
          <th className="px-4 py-3 text-left">User</th>
           <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">List #</th>
          <th className="px-4 py-3 text-left">Joined At</th>
          <th className="px-4 py-3 text-right">Total Spend</th>
          <th className="px-4 py-3 text-center">Last Signed In</th>
        </tr>
      </thead>

    <tbody>
  {users.map((user) => {
    const userStats = listsByUser[user.id] || {
      count: 0,
      totalSpend: 0,
    };

    return (
      <tr
        key={user.id}
        className="border-b cursor-pointer border-b-background hover:bg-gray-50 transition"
        
      >
        
        {/* IMAGE */}
          <td className="px-2 m-4 flex justify-center items-center
          h-10 w-10 rounded-full bg-[#1EC677]">
                  <Link href={`/dashboard/users/${user.id}`}>
               
                  <User/>
                 </Link>
                 
                </td>
        {/* USER */}
        <td className="px-4 py-3">
          {user.user_metadata.full_name ||
            user.user_metadata.name ||
            "—"}
        </td>

            {/* Email */}
        <td className="px-4 py-3">
          {user.user_metadata.email}
        </td>

        {/* List COUNT */}
        <td className="px-4 py-3">
          {userStats.count} 
        </td>

        {/* CREATED */}
        <td className="px-4 py-3">
          {formatDate(user.created_at)}
        </td>

        {/* TOTAL SPEND */}
        <td className="px-4 py-3 text-right">
          {formatCurrency(userStats.totalSpend)}
        </td>

        {/* LAST LOGIN */}
        <td className="px-4 py-3 text-center">
          {user.last_sign_in_at
            ? formatDate(user.last_sign_in_at)
            : "—"}
        </td>
      </tr>
    );
  })}

  {users.length === 0 && (
    <tr>
      <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
        No users found
      </td>
    </tr>
  )}
</tbody>
    </table>
  </div>
      </div>
       
</div>
            
    )
}

export default UsersWrapper
