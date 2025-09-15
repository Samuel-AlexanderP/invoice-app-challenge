import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useDarkMode from "../hooks/useDarkMode";
import { FaMoon, FaSun, FaTimes, FaBars } from "react-icons/fa";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("authToken"));
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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

  const commonBtnClasses =
    "block px-4 py-2 rounded-lg transition-colors text-white";

  return (
    <nav className="relative bg-white dark:bg-gray-800 shadow-md px-4 py-3 md:px-6 md:py-4 flex items-center justify-between transition-colors">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-gray-800 dark:text-gray-100 font-extrabold text-xl md:text-2xl">
          InvoicePro
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="p-2 rounded-full bg-tertiaryBg dark:bg-tertiaryBg-dark hover:bg-tertiaryBg-dark transition-colors"
        >
          {isDark ? (
            <FaSun className="text-secondaryAccent" />
          ) : (
            <FaMoon className="text-secondaryAccent" />
          )}
        </button>

        {isAuth ? (
          <>
            <Link
              to="/dashboard"
              className={`${commonBtnClasses} bg-blue-600 hover:bg-blue-700 dark:bg-accent dark:hover:bg-accent-hover`}
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className={`${commonBtnClasses} bg-secondaryAccent hover:bg-secondaryAccent/90`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={`${commonBtnClasses} bg-blue-600 hover:bg-blue-700 dark:bg-accent dark:hover:bg-accent-hover`}
            >
              Register
            </Link>
            <Link
              to="/login"
              className={`${commonBtnClasses} bg-secondaryAccent hover:bg-secondaryAccent/90`}
            >
              Login
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 rounded-md focus:outline-none"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <FaTimes className="text-gray-800 dark:text-gray-100" />
        ) : (
          <FaBars className="text-gray-800 dark:text-gray-100" />
        )}
      </button>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 md:hidden z-40">
          {/* Dark Mode inside menu */}
          <button
            onClick={toggle}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {isDark ? <FaSun /> : <FaMoon />}
            <span className="ml-2">Toggle Theme</span>
          </button>

          <hr className="border-gray-200 dark:border-gray-700 my-1" />

          {isAuth ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
