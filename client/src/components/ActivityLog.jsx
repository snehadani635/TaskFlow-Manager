import { formatDistanceToNow } from "date-fns";

export default function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return <p className="text-sm text-gray-400">No activity yet</p>;
  }

  const getIcon = (action) => {
    switch (action) {
      case "created":
        return "➕";
      case "moved":
        return "➡️";
      case "completed":
        return "✅";
      case "updated":
        return "✏️";
      default:
        return "📝";
    }
  };

  const getMessage = (log) => {
    switch (log.action) {
      case "created":
        return "Task created";
      case "moved":
        return `Moved from ${log.from} to ${log.to}`;
      case "completed":
        return "Marked as done";
      case "updated":
        return "Task updated";
      default:
        return log.action;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Activity</h4>
      <div className="space-y-1.5">
        {activities.slice(-5).reverse().map((log, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{getIcon(log.action)}</span>
            <div className="flex-1">
              <p>{getMessage(log)}</p>
              <p className="text-gray-400">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}