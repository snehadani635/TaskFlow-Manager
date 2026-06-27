import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <p className="mt-2 text-gray-500">Page not found.</p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm text-white"
      >
        Go Home
      </Link>
    </div>
  );
}