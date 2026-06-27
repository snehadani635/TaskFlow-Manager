export default function Spinner({ full }) {
  return (
    <div
      className={`flex items-center justify-center ${
        full ? "h-[60vh]" : "py-6"
      }`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );
}