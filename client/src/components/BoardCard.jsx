import { Link } from "react-router-dom";

export default function BoardCard({ board, onRename, onDelete }) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/boards/${board._id}`}>
        <h3 className="text-lg font-semibold text-brand-600">{board.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {board.description || "No description"}
        </p>
      </Link>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onRename(board)}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Rename
        </button>
        <button
          onClick={() => onDelete(board)}
          className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30"
        >
          Delete
        </button>
      </div>
    </div>
  );
}