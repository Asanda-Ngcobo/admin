'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loading from '../../loading';
import { DollarSign, FileText, UserPlus } from '@deemlol/next-icons';

function UserPageClient({ profile, userLists, listItems }) {
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const listItemsNumber = listItems.length
  console.log(listItemsNumber)

  useEffect(() => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    setUser(profile);
    setLists(userLists || []);
    setLoading(false);
  }, [profile, userLists]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-400">
        User not found.
      </div>
    );
  }

  const formatCurrency = (value) =>
    `R${Number(value || 0).toFixed(2)}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="mt-20 px-[5%] pb-10 text-black">
      <div className="flex flex-col xl:flex-row gap-8">
        
      

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/users"
              className="text-sm text-(--accent-secondary)  hover:text-blue-300 transition"
            >
              ← Back to Users
            </Link>
  {/* Sidebar */}
        <div className="xl:w-70 w-full">
          <div className=" rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold wrap-break-word">
                {user.fullName}
              </h1>

              <p className="text-sm  break-all">
                {user.email}
              </p>

              <p className="text-sm mt-2">
                Joined {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>
            <div>
              <p className="text-sm text-white/60 mt-1">
                Overview of user activity and grocery lists.
              </p>
            </div>
          </div>
           <ul className="flex gap-4">
        {/* USERS */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <FileText />
            <h1>Lists</h1>
          </div>
          <h1 className="text-4xl">{lists.length}</h1>
        </li>

        {/* SUMMARIES */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <DollarSign />
            <h1>Avg Monthly Spend</h1>
          </div>
          <h1 className="text-4xl">  {formatCurrency(user.avg_monthly_spend)} </h1>
        </li>

        {/* REVENUE */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <UserPlus />
            <h1>Grossary Plus</h1>
          </div>
          <h1 className="text-4xl">
          {user.is_plus ? 'Active' : 'Inactive'}
          </h1>
        </li>

       
      </ul>
        

          {/* Lists */}
          <div className="mt-10">
            <div className="  border border-white/10 overflow-hidden">
              {lists.length === 0 ? (
                <div className="p-6 text-sm text-white/60">
                  No lists found for this user.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
                  <table className="w-full min-w-225 text-sm">
                    <thead className="sticky top-0 bg-(--accent-primary) z-10">
                      <tr className="border-b border-white/10 text-left">
                        <th className="p-4 font-medium">List Name</th>
                         <th className="p-4 font-medium">List Items #</th>
                    
                        <th className="p-4 font-medium">Spent</th>
                      
                        <th className="p-4 font-medium">Created</th>
                        <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lists.map((list) => {
                    

                        return (
                          <tr
                            key={list.id}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="p-4">
                              <Link
                                href={`/dashboard/users/${user.id}/${list.id}`}
                                className="hover:text-(--accent-secondary)  transition font-medium"
                              >
                                {list.list_name}
                              </Link>
                            </td>

                       
                            <td className="p-4">
                              {formatCurrency(list.money_spent)}
                            </td>

            

                            <td className="p-4">
                              {formatDate(list.created_at)}
                            </td>

                            <td className="p-4">
                              {list.shopped_at ? (
                                <span className="text-green-400">
                                  Completed
                                </span>
                              ) : (
                                <span className="text-yellow-400">
                                  Active
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-[#04284B] border border-white/10 rounded-2xl p-5">
      <p className="text-sm text-white/60">{title}</p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}

export default UserPageClient;