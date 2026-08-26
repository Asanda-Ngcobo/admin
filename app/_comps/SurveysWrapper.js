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


import { BarChart, Cpu, DollarSign, FileText, User, Users } from "@deemlol/next-icons";
import Link from "next/link";



function SurveysWrapper({surveys = [] }) {
  const [duration, setDuration] = useState(30);

  // ✅ Filter users
//   const filteredUsers = useMemo(() => {
//     if (duration === "all") return users;
//     const cutoff = new Date(Date.now() - duration * 86400000);
//     return users.filter(u => new Date(u.created_at) >= cutoff);
//   }, [users, duration]);

//all users

const allsurveys = surveys.length;

  // ✅ Filter summaries
  const filteredSurveys = useMemo(() => {
    if (duration === "all") return surveys;
    const cutoff = new Date(Date.now() - duration * 86400000);
    return surveys.filter(s => new Date(s.created_at) >= cutoff);
  }, [surveys, duration]);

  // ✅ shopped lists
  //  const shoppedLists = filteredLists.filter(s => s.shopped_at !== null);
 


 const chartData = useMemo(() => {
  const grouped = {};

  filteredSurveys.forEach((s) => {
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
}, [filteredSurveys]);

  // Pie Chart Data
//  const shoppedUnshoppedPieData = useMemo(() => {
//   let shoppedCount = 0;
//   let unshoppedCount = 0;

//   filteredLists.forEach((s) => {
//     if (s.money_spent !== null) {
//       shoppedCount += 1;
//     } else {
//       unshoppedCount += 1;
//     }
//   });

//   return [
//     { name: "Shopped", value: shoppedCount },
//     { name: "Unshopped", value: unshoppedCount },
//   ];
// }, [filteredLists]);



const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });



 
  return (
    <div className="py-2 px-4 mt-2 lg:w-[96%] lg:mx-auto">
      <div className="flex justify-between mx-5 my-4">
        <div>
        <h1>Surveys</h1>
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
            <h1>All Surveys</h1>
          </div>
          <h1 className="text-4xl">{allsurveys}</h1>
        </li>

        {/* SUMMARIES */}
        <li className="w-1/4 bg-white h-60 rounded-lg flex flex-col justify-center items-center gap-4">
          <div className="flex gap-4 items-center">
            <FileText />
            <h1>Monthly Surveys</h1>
          </div>
          <h1 className="text-4xl">{filteredSurveys.length} </h1>
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
          <th className="px-4 py-3 text-left">Image</th>
          <th className="px-4 py-3 text-left">Email</th>
          <th className="px-4 py-3 text-left">Challenge</th>
          <th className="px-4 py-3 text-left">Current Method</th>
           <th className="px-4 py-3 text-right">Weekly Feature?</th>
          <th className="px-4 py-3 text-right">Recommend?</th>
          <th className="px-4 py-3 text-center">Feedback</th>
            <th className="px-4 py-3 text-center">Funnel</th>
             <th className="px-4 py-3 text-center">Created At</th>
        </tr>
      </thead>

      <tbody>

        
        {surveys.map((survey) => {
 const weeklyFeatures = survey.weekly_features?.join(", ") || "";
          return(
 <tr
            key={survey.id}
            className="border-b hover:bg-gray-50 transition cursor-pointer"
          >
                   <td className="px-2 m-4 flex justify-center items-center
          h-10 w-10 rounded-full bg-[#1EC677]">
                  <Link href={`/dashboard/users/${survey.user_id}`}>
               
                  <User/>
                 </Link>
                 
                </td>
            <td className="px-4 py-3">{survey.email}</td>

            <td className="px-4 py-3 capitalize">
              {survey.challenge}
            </td>
            <td className="px-4 py-3">
              {survey.current_method}
            </td>

              <td className="px-4 py-3">
              {weeklyFeatures}
            </td>
              <td className="px-4 py-3">
              {survey.cheapest_store_interest}
            </td>
              <td className="px-4 py-3">
              {survey.feedback}
            </td>
              <td className="px-4 py-3">
              {survey.funnel}
            </td>
            <td className="px-4 py-3 text-right">
              {formatDate(survey.created_at) ?? '-'}
            </td>
          
          </tr>
          )
         
})}

        {surveys.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="px-4 py-6 text-center text-gray-400"
            >
              No surveys found
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

export default SurveysWrapper;