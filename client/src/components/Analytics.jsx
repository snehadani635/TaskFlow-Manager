import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import api from "../api/axios.js";

const STATUS_COLORS = {
  todo: "#3b82f6",
  "in-progress": "#f59e0b",
  done: "#10b981",
};

const PRIORITY_COLORS = {
  low: "#10b981",
  med: "#f59e0b",
  high: "#ef4444",
};

export default function Analytics({ boardId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const params = boardId ? { board: boardId } : {};
      const res = await api.get("/tasks/analytics", { params });
      setData(res.data);
      setLoading(false);
    };
    load();
  }, [boardId]);

  if (loading) return <p className="text-center py-4">Loading analytics...</p>;
  if (!data) return null;

  const statusData = [
    { name: "To Do", value: data.byStatus.todo, color: STATUS_COLORS.todo },
    { name: "In Progress", value: data.byStatus["in-progress"], color: STATUS_COLORS["in-progress"] },
    { name: "Done", value: data.byStatus.done, color: STATUS_COLORS.done },
  ];

  const priorityData = [
    { name: "Low", value: data.byPriority.low },
    { name: "Medium", value: data.byPriority.med },
    { name: "High", value: data.byPriority.high },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Tasks" value={data.total} />
        <StatCard label="To Do" value={data.byStatus.todo} color="blue" />
        <StatCard label="In Progress" value={data.byStatus["in-progress"]} color="yellow" />
        <StatCard label="Overdue" value={data.overdue} color="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "gray" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}