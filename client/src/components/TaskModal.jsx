import { useState } from "react";
import api from "../api/axios.js";

const empty = {
  title: "",
  description: "",
  priority: "med",
  status: "todo",
  dueDate: "",
  estimatedEffort: "",
};

export default function TaskModal({ boardId, initial, onClose, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : "",
        }
      : empty
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const suggest = async () => {
    setAiLoading(true);
    setError("");
    try {
      const { data } = await api.post("/ai/suggest", {
        title: form.title,
        description: form.description,
      });
      setAiResult(data);
    } catch (e) {
      setError(e.response?.data?.message || "AI suggestion failed");
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAi = () => {
    if (!aiResult) return;
    setForm({
      ...form,
      estimatedEffort: aiResult.effort,
      dueDate: aiResult.suggestedDueDate.slice(0, 10),
    });
    setAiResult(null);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, board: boardId };
      if (!payload.dueDate) delete payload.dueDate;
      if (initial) await api.put(`/tasks/${initial._id}`, payload);
      else await api.post("/tasks", payload);
      onSaved();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">
          {initial ? "Edit Task" : "New Task"}
        </h3>
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={save} className="space-y-3">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={set("title")}
            required
          />
          <textarea
            className="input"
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={set("description")}
          />
          <div className="grid grid-cols-2 gap-3">
            <select className="input" value={form.priority} onChange={set("priority")}>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
            <select className="input" value={form.status} onChange={set("status")}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <input
              className="input"
              type="date"
              value={form.dueDate}
              onChange={set("dueDate")}
            />
            <input
              className="input"
              placeholder="Effort (e.g. M / 4h)"
              value={form.estimatedEffort}
              onChange={set("estimatedEffort")}
            />
          </div>

          <button
            type="button"
            onClick={suggest}
            disabled={aiLoading || !form.title}
            className="w-full rounded-lg border border-brand-500 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-50 dark:hover:bg-brand-700/20"
          >
            {aiLoading ? "Thinking..." : "✨ Suggest estimate (AI)"}
          </button>

          {aiResult && (
            <div className="rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-700/20">
              <p>
                <b>Effort:</b> {aiResult.effort} &nbsp;
                <b>Due:</b>{" "}
                {new Date(aiResult.suggestedDueDate).toLocaleDateString()}
              </p>
              <p className="mt-1 text-gray-500">{aiResult.reasoning}</p>
              <p className="mt-1 text-xs italic text-gray-400">
                source: {aiResult.source}
              </p>
              <button
                type="button"
                onClick={acceptAi}
                className="mt-2 rounded bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-700"
              >
                Accept suggestion
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}