import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { InputField } from "../components/InputField";

interface User {
  email: string;
  password: string;
}

interface LocationState {
  registered?: boolean;
}

export default function Login() {
  // ── State hooks for inputs and errors ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as LocationState;
  const [showSuccess, setShowSuccess] = useState(!!state?.registered);

  // Clear the history state so refresh won't re‑show the banner
  useEffect(() => {
    if (showSuccess) {
      // Replace the history entry without the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [showSuccess, navigate, location.pathname]);

  // ── Form submit handler ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ── Basic validation ──
    if (!email.trim() || password.length < 6) {
      setError("Please enter your email and password.");
      return;
    }

    // ── Fetch registered users ──
    const raw = localStorage.getItem("users") || "[]";
    const users: User[] = JSON.parse(raw);

    // ── Check credentials ──
    const matched = users.find(
      (user) => user.email === email.trim() && user.password === password
    );

    if (!matched) {
      setError("Invalid email or password.");
      return;
    }

    // ── Simulate authentication ──
    localStorage.setItem("authToken", "true");

    // ── Clear error and navigate to Dashboard ──
    setError("");
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-secondaryBg dark:bg-secondaryBg-dark p-8 rounded-lg transition-colors shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Banner */}
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded flex justify-between items-center">
              <span>Registration successful! Please log in.</span>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="text-green-800 font-bold"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}
          {/* Email Input */}
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="off"
          />

          {/* Password Input */}
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          {/* Error Message */}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full py-2 rounded text-white transition-colors
              bg-blue-600 hover:bg-blue-700
              dark:bg-accent dark:hover:bg-accent-hover
            "
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-primary dark:text-primary-dark text-sm">
          Dont have an account?{" "}
          <Link
            to="/register"
            className="
            text-blue-600 hover:underline transition-colors
            dark:text-secondaryAccent/80 dark:hover:text-secondaryAccent"
          >
            Register
          </Link>
        </p>
      </div>
    </Layout>
  );
}
