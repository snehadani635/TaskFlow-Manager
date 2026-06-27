import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-600">
          TaskFlow
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-lg px-2 py-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Toggle theme"
          >
            {dark ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <span className="hidden text-sm sm:inline">Hi, {user.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}