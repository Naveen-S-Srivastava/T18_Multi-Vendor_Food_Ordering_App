import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueChartData } from "../../../utils/dummyData.js";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-xl px-3 py-2 text-xs">
        <p className="font-semibold mb-1">Income</p>
        <p className="text-gray-600">${payload[0].value}k</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Revenue</h2>
        <div className="flex items-center gap-3 text-xs">
          <button className="px-3 py-1 rounded-full bg-black text-white">
            All
          </button>
          <button className="px-3 py-1 rounded-full bg-[#f5f5f7] text-gray-600">
            Food
          </button>
          <button className="px-3 py-1 rounded-full bg-[#f5f5f7] text-gray-600">
            Beverages
          </button>
          <button className="px-3 py-1 rounded-full bg-[#f5f5f7] text-gray-700">
            Weekly
          </button>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueChartData} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => `$${v}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="b"
              stroke="#6366f1"
              fill="url(#colorB)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="a"
              stroke="#a855f7"
              fill="url(#colorA)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
