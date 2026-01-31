import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const userData = [
  { month: "Jan", users: 650 },
  { month: "Feb", users: 380 },
  { month: "Mar", users: 780 },
  { month: "Apr", users: 520 },
  { month: "May", users: 420 },
  { month: "June", users: 850 },
  { month: "July", users: 580 },
  { month: "Aug", users: 620 },
  { month: "Sep", users: 750 },
  { month: "Oct", users: 680 },
  { month: "Nov", users: 540 },
  { month: "Dec", users: 720 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 text-white bg-[#71ABE0] rounded shadow-lg">
        <p className="text-sm font-medium">{`Users: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const UserRatioChart = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div
    style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
    className="p-6 bg-white border rounded-lg ">
      {/*============================== Header ==============================*/}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">User Ratio</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#71ABE0] rounded-full"></div>
            <span className="text-sm text-gray-600">Users</span>
          </div>
        </div>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#71ABE0] border-none rounded outline-none cursor-pointer"
          >
            <option value="2024">Year-2025</option>
            <option value="2024">Year-2024</option>
            <option value="2023">Year-2023</option>
            <option value="2022">Year-2022</option>
          </select>
        </div>
      </div>

      {/*============================== Chart ==============================*/}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={userData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              domain={[0, 800]}
              tickFormatter={(value) => `${value}.00`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
            <Bar
              dataKey="users"
              fill="#71ABE0"
              radius={[10, 10, 0, 0]}
              barSize={30} 
              onMouseEnter={(e) => handleMouseEnter(e.index)} 
              onMouseLeave={handleMouseLeave} 
              // background={{ fill: "#e0e0e0" }}
              fillOpacity={hoveredIndex !== null ? (hoveredIndex === 0 ? 1 : 0.7) : 1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserRatioChart;
