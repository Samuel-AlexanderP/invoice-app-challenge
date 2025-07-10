import Layout from "../components/Layout";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { InputField } from "../components/InputField";

interface User {
  email: string;
  password: string;
}

export default function Register() {
  //  State hooks for form fields and error messaging
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    // Simple email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  //  Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent full‑page reload

    const newErrors: typeof errors = {};

    //  Basic validations
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    //  Load existing users from localStorage
    const raw = localStorage.getItem("users") || "[]";
    const users: User[] = JSON.parse(raw);

    //  Prevent duplicate registration
    if (
      users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    ) {
      setErrors({ email: "This email is already registered." });
      return;
    }

    //  Append new user and save back
    users.push({ email: email.trim(), password });
    localStorage.setItem("users", JSON.stringify(users));

    // Clear error and redirect to Login
    setErrors({});
    // Navigate to /login and pass a "registered" flag
    navigate("/login", { state: { registered: true } });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-secondaryBg dark:bg-secondaryBg-dark p-8 transition-colors rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={!!errors.email}
            errorText={errors.email}
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
            error={!!errors.password}
            errorText={errors.password}
            required
            autoComplete="new-password"
          />
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white py-2 rounded bg-blue-600  hover:bg-blue-700 dark:bg-accent dark:hover:bg-accent-hover transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-primary dark:text-primary-dark text-sm">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline transition-colors
            dark:text-secondaryAccent/80 dark:hover:text-secondaryAccent"
          >
            Log in
          </Link>
        </p>
      </div>
    </Layout>
  );
}
