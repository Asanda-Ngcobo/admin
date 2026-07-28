"use client";
import { useState, useMemo } from "react";
import ReportDuration from "./ReportDuration";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
   PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


import { BarChart, DollarSign, FileText, Users } from "@deemlol/next-icons";
import Link from "next/link";



function ReportsWrapper({ users = [], lists = [] }) {
  const [duration, setDuration] = useState(30);

  // ✅ Filter users
  const filteredUsers = useMemo(() => {
    if (duration === "all") return users;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return users.filter(u => new Date(u.created_at) >= cutoff);
  }, [users, duration]);

  // ✅ Filter summaries
  const filteredLists = useMemo(() => {
    if (duration === "all") return lists;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return lists.filter(s => new Date(s.created_at) >= cutoff);
  }, [lists, duration]);

  // ✅ Paid summaries + revenue
  const plusSubs = filteredUsers.filter(s => s.is_plus);
   const shoppedLists = filteredLists.filter(s => s.shopped_at !== null);
  const revenue = plusSubs.reduce(
    (sum, s) => sum + Number(s.price_zar || 0),
    0
  );

  // ✅ Average price
  // const averagePrice =
  //   paidSummaries.length > 0
  //     ? revenue / paidSummaries.length
  //     : 0;

  // ✅ Chart data (sorted correctly)

  const chartData = useMemo(() => {
    return plusSubs
      .map(s => ({
        timestamp: new Date(s.created_at).getTime(),
        date: new Date(s.created_at).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
        }),
        spent: Number(s.price_zar || 0),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredUsers]);

  // Pie Chart Data
//  const contractTypePieData = useMemo(() => {
//   const counts = {};

//   filteredSummaries.forEach((s) => {
//     if (!s.contract_type) return;
//     counts[s.contract_type] = (counts[s.contract_type] || 0) + 1;
//   });

//   return Object.entries(counts).map(([name, value]) => ({
//     name,
//     value,
//   }));
// }, [filteredSummaries]);

const COLORS = ['#2F8F83', '#A8DADC', '#F4D35E', '#E76F51'];

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

  const latestLists = lists.slice(0, 5);
  return (
    <div className="py-2 px-4 mt-2 lg:w-[96%] lg:mx-auto">
      <div className="flex justify-between mx-5 my-4">
        <div>
        <h1>Dashboard</h1>
        <p>Here is your saas analytics</p>
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
            <h1>Users</h1>
          </div>
          <h1 className="text-4xl">{filteredUsers.length}</h1>
        </li>

        {/* SUMMARIES */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <FileText />
            <h1>Lists</h1>
          </div>
          <h1 className="text-4xl">{filteredLists.length} <span className="text-sm text-(--accent-secondary)">
            ({shoppedLists.length})</span></h1>
        </li>

        {/* REVENUE */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <BarChart />
            <h1>Revenue</h1>
          </div>
          <h1 className="text-4xl">
            R {revenue.toFixed(2)}
          </h1>
        </li>

        {/* AVERAGE */}
        {/* <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <DollarSign />
            <h1>Average Price</h1>
          </div>
          <h1 className="text-4xl">
            R {averagePrice.toFixed(2)}
          </h1>
        </li> */}
      </ul>
    {/* Graphs Container */}
      <div className="flex gap-4 my-2">
         {/* LINE CHART */}
   
        {/* <div className="w-3/5 h-fit bg-white rounded-sm">
           <div className="mt-6 p-4 rounded-lg">
        <h2 className="text-[#8F8C8C] text-lg mb-2">
          Revenue Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(v) =>
                new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(v)
              }
            />
            <Line
              type="monotone"
              dataKey="spent"
              stroke="#2F8F83"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div> */}
        {/* Pie Chart */}
        {/* <div className="w-2/5 bg-white h-fit rounded-sm">
        <div className="mt-8 p-4 rounded-lg">
  <h2 className="text-[#8F8C8C] text-lg mb-2">
    Popular Contract Types
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={contractTypePieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ name, percent }) =>
          ` ${(percent * 100).toFixed(0)}%`
        }
      >
        {contractTypePieData.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend
        wrapperStyle={{
          fontSize: "12px",
          marginTop: "12px",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
</div>
</div> */}

      </div>
       <div className="w-full flex justify-end">

        <div className="w-fit underline text-blue-400">
          <Link href='/dashboard/lists'
       className="p-2">More Lists</Link></div>
       </div>
   <div className="bg-white h-fit w-full rounded-sm overflow-hidden">
   
    
  <div className="h-full overflow-y-auto">
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 bg-(--accent-primary) text-white">
        <tr>
          <th className="px-4 py-3 text-left">List Name</th>
          <th className="px-4 py-3 text-left">Created at</th>
          <th className="px-4 py-3 text-left">Money Spent</th>
          <th className="px-4 py-3 text-left">Shopped at</th>
       
        </tr>
      </thead>

      <tbody>

        
        {latestLists.map((list) => (
          <tr
            key={list.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3">{list.list_name}</td>

            <td className="px-4 py-3">
              {formatDate(list.created_at)}
            </td>

            <td className="px-4 py-3 ">
              {formatCurrency(list.money_spent)}
            </td>

             <td className="px-4 py-3">
              {formatDate(list.shopped_at)}
            </td>
            
          </tr>
        ))}

        {lists.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="px-4 py-6 text-center text-gray-400"
            >
              No summaries found
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

export default ReportsWrapper;