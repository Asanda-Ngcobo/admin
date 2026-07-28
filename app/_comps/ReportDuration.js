"use client";
import { Lexend_Deca } from "next/font/google";
import { useState } from "react";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

const durationOptions = [
  { id: 1, value: 30 },
  { id: 2, value: 60 },
  { id: 3, value: 90 },
  { id: 4, value: 120 },
  { id: 5, value: 150 },
  { id: 6, value: 180 },
  { id: 7, value: 365 },
  { id: 8, value: "all" },
];

// format: 28 Feb 2026
const formatDate = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getDateLabel = (value) => {
  if (value === "all") return "All Time";

  const endDate = new Date(); // today
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - value);

  return `${formatDate(endDate)} – ${formatDate(startDate)}`;
};

function ReportDuration({ onChange }) {
  const [active, setActive] = useState(30);

  const handleChange = (e) => {
    const value = e.target.value === "all" ? "all" : Number(e.target.value);
    setActive(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="m-2">
      <select
        value={active}
        onChange={handleChange}
        className={`${ButtonFont.className}
          bg-(--accent-primary) text-white text-sm px-4 py-2 rounded-full
          focus:outline-none focus:ring-2 focus:ring-(--accent-primary)
        `}
      >
        {durationOptions.map((time) => (
          <option key={time.id} value={time.value}
        >  
               {getDateLabel(time.value)}
     
          </option>
        ))}
      </select>
    </div>
  );
}

export default ReportDuration;