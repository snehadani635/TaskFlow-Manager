import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/axios.js";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import Analytics from "../components/Analytics.jsx";
import Spinner from "../components/Spinner.jsx";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [sort, setSort] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [search, setSearch] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = { board: id };
    if (sort) params.sort = sort;
    if (filterPriority) params.priority = filterPriority;
    if (search) params.search = search;
    const [b, t] = await Promise.all([
      api.get(`/boards/${id}`),
      api.get("/tasks", { params }),
    ]);
    setBoard(b.data);
    setTasks(t.data);
    setLoading(false);
  }, [id, sort, filterPriority, search]);

  useEffect(() => {
    load();
  }, [load]);

  const move = async (task, status) => {
    await api.put(`/tasks/${task._id}`, { status });
    load();
  };

  const remove = async (task) => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      await api.delete(`/tasks/${task._id}`);
      load();
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const task = tasks.find((t) => t._id === draggableId);
    if (task && task.status !== destination.droppableId) {
      await move(task, destination.droppableId);
    }
  };

  if (loading) return <Spinner full />;
  if (!board) return <p className="p-8 text-center">Board not found.</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="text-sm text-brand-600">
        ← Back to boards
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-700/20"
        >
          {showAnalytics ? "Hide" : "Show"} Analytics 📊
        </button>
      </div>

      {showAnalytics && (
        <div className="mt-6">
          <Analytics boardId={id} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 min-w-[200px]"
        />
        <select
          className="input w-auto"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="med">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="input w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort: Newest</option>
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
        </select>
        <button
          onClick={() => setModal({ new: true })}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <Droppable key={col.key} droppableId={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl p-3 transition ${
                      snapshot.isDraggingOver
                        ? "bg-brand-100 dark:bg-brand-900/30"
                        : "bg-gray-100 dark:bg-gray-800/50"
                    }`}
                  >
                    <h2 className="mb-3 flex items-center justify-between text-sm font-semibold uppercase text-gray-500">
                      {col.label}
                      <span className="rounded-full bg-gray-200 px-2 text-xs dark:bg-gray-700">
                        {colTasks.length}
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {colTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onEdit={(t) => setModal({ task: t })}
                                onDelete={remove}
                                onMove={move}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colTasks.length === 0 && (
                        <p className="py-4 text-center text-xs text-gray-400">
                          Drop tasks here
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {modal && (
        <TaskModal
          boardId={id}
          initial={modal.task}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}