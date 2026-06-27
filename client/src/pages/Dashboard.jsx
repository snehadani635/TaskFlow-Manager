import { useEffect, useState } from "react";
import api from "../api/axios.js";
import BoardCard from "../components/BoardCard.jsx";
import Analytics from "../components/Analytics.jsx";
import Spinner from "../components/Spinner.jsx";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/boards");
    setBoards(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post("/boards", form);
    setForm({ title: "", description: "" });
    setCreating(false);
    load();
  };

  const rename = async (board) => {
    const title = prompt("New board title:", board.title);
    if (title && title.trim()) {
      await api.put(`/boards/${board._id}`, { title });
      load();
    }
  };

  const remove = async (board) => {
    if (window.confirm(`Delete "${board.title}" and all its tasks?`)) {
      await api.delete(`/boards/${board._id}`);
      load();
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Boards</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-700/20"
          >
            {showAnalytics ? "Hide" : "Show"} Analytics 📊
          </button>
          <button
            onClick={() => setCreating(!creating)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            + New Board
          </button>
        </div>
      </div>

      {showAnalytics && (
        <div className="mb-6">
          <Analytics />
        </div>
      )}

      {creating && (
        <form
          onSubmit={create}
          className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <input
            className="input"
            placeholder="Board title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="input"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
            Create
          </button>
        </form>
      )}

      {boards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
          <p className="text-lg font-medium">No boards yet</p>
          <p className="mt-1 text-gray-500">
            Create your first board to start organizing tasks.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm text-white"
          >
            + Create a board
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => (
            <BoardCard
              key={b._id}
              board={b}
              onRename={rename}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}