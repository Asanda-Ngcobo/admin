'use client'
import { User, UserPlus, Users } from "@deemlol/next-icons";
import { useMemo, useState } from "react";
import ReportDuration from "@/app/_comps/ReportDuration";
import Link from "next/link";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#1EC677", "#3B82F6", "#F59E0B"];

function UsersWrapper({ users, lists, listItems }) {
  const [duration, setDuration] = useState(30);

  const [filters, setFilters] = useState({
    hasNoList: false,
    hasList: false,
    hasListItem: false,
    hasSpend: false,
  });

  const toggleFilter = (key) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // hasNoList and hasList are mutually exclusive — otherwise the
      // combination always yields zero results with no explanation
      if (key === "hasList" && next.hasList) next.hasNoList = false;
      if (key === "hasNoList" && next.hasNoList) next.hasList = false;
      return next;
    });
  };

  // ✅ Filter users by duration
  const filteredUsers = useMemo(() => {
    if (duration === "all") return users;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return users.filter((u) => new Date(u.created_at) >= cutoff);
  }, [users, duration]);

  // ✅ Filter lists by duration
  const filteredLists = useMemo(() => {
    if (duration === "all") return lists;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return lists.filter((s) => new Date(s.created_at) >= cutoff);
  }, [lists, duration]);

  // ✅ Paid summaries + revenue
  const shoppedLists = useMemo(
    () => filteredLists.filter((s) => s.shopped_at !== null),
    [filteredLists]
  );

  const revenue = useMemo(
    () => shoppedLists.reduce((sum, s) => sum + Number(s.money_spent || 0), 0),
    [shoppedLists]
  );

  // ✅ User Spend (guarded against divide-by-zero)
  const averageSpend =
    shoppedLists.length > 0 && filteredUsers.length > 0
      ? revenue / filteredUsers.length
      : 0;

  // ✅ Summaries per user (guarded against divide-by-zero)
  const listPerUser =
    filteredLists.length > 0 && filteredUsers.length > 0
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

  // ✅ Per-user list / list-item / spend stats (all-time, not duration-filtered)
  const listsByUser = useMemo(() => {
    const map = {};
    const listToUser = {};

    lists.forEach((s) => {
      if (!s.user_id) return;

      listToUser[s.id] = s.user_id;

      if (!map[s.user_id]) {
        map[s.user_id] = { count: 0, totalSpend: 0, itemsCount: 0 };
      }

      map[s.user_id].count += 1;

      if (s.money_spent !== null) {
        map[s.user_id].totalSpend += Number(s.money_spent || 0);
      }
    });

    listItems.forEach((item) => {
      const userId = listToUser[item.list_id];
      if (!userId) return;

      if (!map[userId]) {
        map[userId] = { count: 0, totalSpend: 0, itemsCount: 0 };
      }

      map[userId].itemsCount += 1;
    });

    return map;
  }, [lists, listItems]);

  // ✅ Table filters
  const displayedUsers = useMemo(() => {
    return users.filter((user) => {
      const stats = listsByUser[user.id] || {
        count: 0,
        totalSpend: 0,
        itemsCount: 0,
      };

      if (filters.hasNoList && stats.count > 0) return false;
      if (filters.hasList && stats.count < 1) return false;
      if (filters.hasListItem && stats.itemsCount < 1) return false;
      if (filters.hasSpend && stats.totalSpend <= 0) return false;

      return true;
    });
  }, [users, listsByUser, filters]);

  // ✅ Engagement breakdown (pie chart)
  const activityBreakdown = useMemo(() => {
    const total = users.length;
    let hasList = 0;
    let hasListItem = 0;
    let hasSpend = 0;

    users.forEach((user) => {
      const stats = listsByUser[user.id] || {
        count: 0,
        totalSpend: 0,
        itemsCount: 0,
      };

      if (stats.count >= 1) hasList++;
      if (stats.itemsCount >= 1) hasListItem++;
      if (stats.totalSpend > 0) hasSpend++;
    });

    const pct = (n) => (total > 0 ? Number(((n / total) * 100).toFixed(1)) : 0);

    return [
      { name: "Created a List", value: pct(hasList), count: hasList },
      { name: "Added Items", value: pct(hasListItem), count: hasListItem },
      { name: "Shopped", value: pct(hasSpend), count: hasSpend },
    ];
  }, [users, listsByUser]);

  // ✅ Monthly user growth (bar chart) — pulled out as its own top-level hook
  const monthlyGrowth = useMemo(() => {
    const buckets = {};

    filteredUsers.forEach((user) => {
      const date = new Date(user.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!buckets[key]) {
        buckets[key] = {
          key,
          label: date.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
          count: 0,
        };
      }
      buckets[key].count += 1;
    });

    return Object.values(buckets).sort((a, b) => a.key.localeCompare(b.key));
  }, [filteredUsers]);

  return (
    <div className="py-2 px-4 mt-2 lg:w-[96%] lg:mx-auto ">
      <div className="flex justify-between right-0 mb-4 fixed top-0 mx-auto  z-20 h-20 bg-white w-[85%]">
        <div>
          <h1>Users</h1>
          <p>Here is your users analytics</p>
        </div>

        <div className="flex gap-3 mx-5 mb-3 h-15 justify-center items-center">
          <button
            onClick={() => toggleFilter("hasNoList")}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filters.hasNoList
                ? "bg-(--accent-primary) text-white border-(--accent-primary)"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            Has No List
          </button>

          <button
            onClick={() => toggleFilter("hasList")}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filters.hasList
                ? "bg-(--accent-primary) text-white border-(--accent-primary)"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            Has List
          </button>

          <button
            onClick={() => toggleFilter("hasListItem")}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filters.hasListItem
                ? "bg-(--accent-primary) text-white border-(--accent-primary)"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            Has List Item
          </button>

          <button
            onClick={() => toggleFilter("hasSpend")}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filters.hasSpend
                ? "bg-(--accent-primary) text-white border-(--accent-primary)"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            Spend &gt; 0
          </button>
        </div>

        <div>
          <ReportDuration onChange={setDuration} />
        </div>
      </div>

      <ul className="flex gap-4 my-10 ">
        {/* USERS */}
        <li className="w-1/4 bg-white h-80 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <Users />
            <h1>All Users</h1>
          </div>
          <h1 className="text-4xl">{users.length}</h1>
        </li>

        {/* SUMMARIES */}
        <li className="w-1/4 bg-white h-80 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <UserPlus />
            <h1>New Users</h1>
          </div>
          <h1 className="text-4xl">{filteredUsers.length}</h1>
        </li>

        {/* ENGAGEMENT PIE CHART */}
        <li className="w-2/4 h-80 p-2 bg-white rounded-lg flex flex-col justify-center items-center gap-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) => `${value}%`}
              >
                {activityBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.count} users)`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </li>
      </ul>

      {/* MONTHLY GROWTH BAR CHART */}
      <div className="bg-white rounded-lg p-4 mt-3" style={{ height: 320 }}>
        <h2 className="mb-2 text-sm text-gray-500">Monthly User Growth</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} users`, "New Users"]} />
            <Bar dataKey="count" fill="#1EC677" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white h-[55vh] w-full rounded-sm overflow-hidden mt-3">
        <div className="h-full overflow-y-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-(--accent-primary) text-white">
              <tr>
                <th className="px-4 py-3 text-left">Photo</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">List #</th>
                <th className="px-4 py-3 text-left">List Items #</th>
                <th className="px-4 py-3 text-left">Joined At</th>
                <th className="px-4 py-3 text-right">Total Spend</th>
                <th className="px-4 py-3 text-center">Last Signed In</th>
              </tr>
            </thead>

            <tbody>
              {displayedUsers.map((user) => {
                const userStats = listsByUser[user.id] || {
                  count: 0,
                  totalSpend: 0,
                  itemsCount: 0,
                };

                return (
                  <tr
                    key={displayedUsers.id}
                    className="border-b cursor-pointer border-b-background hover:bg-gray-50 transition"
                  >
                    {/* IMAGE */}
                    <td className="px-2 m-4 flex justify-center items-center h-10 w-10 rounded-full bg-[#1EC677]">
                      <Link href={`/dashboard/users/${displayedUsers.id}`}>
                        <User />
                      </Link>
                    </td>

                    {/* USER */}
                    <td className="px-4 py-3">
                      {user.user_metadata.full_name || user.user_metadata.name || "—"}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">{user.user_metadata.email}</td>

                    {/* List COUNT */}
                    <td className="px-4 py-3">{userStats.count}</td>

                    {/* List Items COUNT */}
                    <td className="px-4 py-3">{userStats.itemsCount || 0}</td>

                    {/* CREATED */}
                    <td className="px-4 py-3">{formatDate(user.created_at)}</td>

                    {/* TOTAL SPEND */}
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(userStats.totalSpend)}
                    </td>

                    {/* LAST LOGIN */}
                    <td className="px-4 py-3 text-center">
                      {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "—"}
                    </td>
                  </tr>
                );
              })}

              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersWrapper;
