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


import { BarChart, Cpu, DollarSign, FileText, Users } from "@deemlol/next-icons";
import Link from "next/link";



function SummariesWrapper({lists = [] }) {
  const [duration, setDuration] = useState(30);

  // ✅ Filter users
//   const filteredUsers = useMemo(() => {
//     if (duration === "all") return users;
//     const cutoff = new Date(Date.now() - duration * 86400000);
//     return users.filter(u => new Date(u.created_at) >= cutoff);
//   }, [users, duration]);

//all users

const alllists = lists.length;

  // ✅ Filter summaries
  const filteredLists = useMemo(() => {
    if (duration === "all") return lists;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return lists.filter(s => new Date(s.created_at) >= cutoff);
  }, [lists, duration]);

  // ✅ shopped lists
   const shoppedLists = filteredLists.filter(s => s.shopped_at !== null);
 

  //Token used

  // const totalTokens = filteredSummaries.reduce(function(acc, t){
  //   return acc + Number(t.tokens_used)
  // }, 0)

  // const avgTokenUsage = totalTokens / filteredSummaries.length;

  // console.log(totalTokens)
 
  // ✅ Chart data (sorted correctly)

 const chartData = useMemo(() => {
  const grouped = {};

  filteredLists.forEach((s) => {
    const dateObj = new Date(s.created_at);

    // Normalize to same day (removes time)
    const dayKey = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate()
    ).getTime();

    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        timestamp: dayKey,
        date: dateObj.toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
        }),
        number: 0,
      };
    }

    grouped[dayKey].number += 1;
  });

  return Object.values(grouped).sort(
    (a, b) => a.timestamp - b.timestamp
  );
}, [filteredLists]);

  // Pie Chart Data
 const shoppedUnshoppedPieData = useMemo(() => {
  let shoppedCount = 0;
  let unshoppedCount = 0;

  filteredLists.forEach((s) => {
    if (s.money_spent !== null) {
      shoppedCount += 1;
    } else {
      unshoppedCount += 1;
    }
  });

  return [
    { name: "Shopped", value: shoppedCount },
    { name: "Unshopped", value: unshoppedCount },
  ];
}, [filteredLists]);



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

 
  return (
    <div className="py-2 px-4 mt-2 lg:w-[96%] lg:mx-auto">
      <div className="flex justify-between mx-5 my-4">
        <div>
        <h1>Summaries</h1>
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
            <h1>All Lists</h1>
          </div>
          <h1 className="text-4xl">{alllists}</h1>
        </li>

        {/* SUMMARIES */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <FileText />
            <h1>Monthly Lists</h1>
          </div>
          <h1 className="text-4xl">{filteredLists.length} <span className="text-sm text-(--accent-secondary)">
            ({shoppedLists.length})</span></h1>
        </li>

        {/* REVENUE */}
        {/* <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <Cpu />
            <h1>Tokens/Summary</h1>
          </div>
          <h1 className="text-4xl">
            {avgTokenUsage.toFixed(2)}
          </h1>
        </li> */}

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
   
        <div className="w-3/5 h-fit bg-white rounded-sm">
           <div className="mt-6 p-4 rounded-lg">
        <h2 className="text-[#8F8C8C] text-lg mb-2">
          Lists Trend
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
  dataKey="number"
  stroke="#0B2E1E"
  strokeWidth={3}
/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
        {/* Pie Chart */}
        <div className="w-2/5 bg-white h-fit rounded-sm">
        <div className="mt-8 p-4 rounded-lg">
  <h2 className="text-[#8F8C8C] text-lg mb-2">
    Shopped VS Unshopped Lists
  </h2>

 <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={shoppedUnshoppedPieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ name, percent }) =>
          `${name} ${(percent * 100).toFixed(0)}%`
        }
      >
        <Cell fill="#0B2E1E" />   {/* Paid - Green */}
        <Cell fill="#E76F51" />   {/* Unpaid - Red */}
      </Pie>

      <Tooltip
        formatter={(value) =>
          new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
          }).format(value)
        }
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div></div>

      </div>
       <div className="w-full flex justify-end">

        {/* <div className="w-fit underline text-blue-400">
          <Link href='/dashboard/summaries'
       className="p-2">More Summaries</Link></div> */}
       </div>
   <div className="bg-white h-min-fit h-max-screen w-full rounded-sm overflow-hidden">
   
    
  <div className="h-[50vh] overflow-y-auto">
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 bg-(--accent-primary) text-white">
        <tr>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Money Spent</th>
          <th className="px-4 py-3 text-left">Created At</th>
          <th className="px-4 py-3 text-right">Shopped at</th>
          <th className="px-4 py-3 text-center">Shopped</th>
        </tr>
      </thead>

      <tbody>

        
        {lists.map((list) => (
          <tr
            key={list.id}
            className="border-b hover:bg-gray-50 transition cursor-pointer"
          >
            <td className="px-4 py-3">{list.list_name}</td>

            <td className="px-4 py-3 capitalize">
              {list.money_spent || "—"}
            </td>
            <td className="px-4 py-3">
              {formatDate(list.created_at)}
            </td>
            <td className="px-4 py-3 text-right">
              {formatDate(list.shopped_at) ?? '-'}
            </td>
            <td className="px-4 py-3 text-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  list.money_spent !== null 
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {   list.money_spent !== null ? "Shopped" : "Not Shopped"}
              </span>
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

export default SummariesWrapper;