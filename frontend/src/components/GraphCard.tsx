
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const GraphCard = ({ title, chartData, dataKey }: { title: string, chartData: any, dataKey: string }) => {
  const getRandomColor = () => {
    const colors = [
      "#6366f1", // indigo
      "#10b981", // emerald
      "#ec4899", // pink
      "#f59e0b", // amber
      "#ef4444", // red
      "#3b82f6", // blue
      "#8b5cf6", // violet
      "#14b8a6", // teal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  return (
    <div className="rounded-2xl shadow-xl bg-white dark:bg-gray-900 p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={getRandomColor()}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};