import ActivityLog from "./ActivityLog.jsx";

const priorityColors = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  med: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const nextStatus = { todo: "in-progress", "in-progress": "done", done: "todo" };

export default function TaskCard({ task, onEdit, onDelete, onMove, isDragging }) {
  const overdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate) < new Date();

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium">{task.title}</h4>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {task.dueDate && (
          <span className={overdue ? "font-semibold text-red-600" : ""}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
            {overdue && " (overdue)"}
          </span>
        )}
        {task.estimatedEffort && <span>⏱ {task.estimatedEffort}</span>}
      </div>

      {/* Activity Log */}
      {task.activityLog && task.activityLog.length > 0 && (
        <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
          <ActivityLog activities={task.activityLog} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onMove(task, nextStatus[task.status])}
          className="rounded border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Move →
        </button>
        <button
          onClick={() => onEdit(task)}
          className="rounded border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}