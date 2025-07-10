import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useDarkMode from "../hooks/useDarkMode";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("authToken"));
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();

  // Check auth token on mount and whenever localStorage changes
  useEffect(() => {
    const handler = () => setIsAuth(!!localStorage.getItem("authToken"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center transition-colors">
      {/* Logo / Brand */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-gray-800 dark:text-gray-100 font-extrabold text-2xl">
          InvoicePro
        </span>
      </Link>

      {/* Right-side controls */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="p-2 rounded-full bg-tertiaryBg hover:bg-tertiaryBg-dark transition-colors"
        >
          {isDark ? (
            <FaSun className="text-secondaryAccent" />
          ) : (
            <FaMoon className="text-secondaryAccent" />
          )}
        </button>

        {/* Auth Links */}
        {isAuth ? (
          <>
            <Link
              to="/dashboard"
              className="px-4 py-2
              bg-blue-600 hover:bg-blue-700
              dark:bg-accent dark:hover:bg-accent-hover text-white rounded-lg transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-secondaryAccent/80 hover:bg-secondaryAccent text-white rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-accent dark:hover:bg-accent-hover text-white rounded-lg transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-secondaryAccent hover:bg-secondaryAccent/80 text-white rounded-lg transition"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
