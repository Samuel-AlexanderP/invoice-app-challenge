import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <Layout>
      <div className="text-center text-base sm:text-lg space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary dark:text-primary-dark">
          Welcome to InvoicePro
        </h2>
        <p className="text-secondary dark:text-secondary-dark">
          The simplest way to create and manage your invoices—no backend
          required.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="
              inline-block px-6 py-3 rounded-lg shadow transition-colors
              bg-blue-600 hover:bg-blue-700
              dark:bg-accent dark:hover:bg-accent-hover text-white
            "
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="
              inline-block px-6 py-3 rounded-lg transition-colors
              border border-blue-600 text-blue-600 hover:bg-blue-100 
              dark:border-accent dark:text-accent dark:hover:bg-accent/10
            "
          >
            I Already Have an Account
          </Link>
        </div>
      </div>
    </Layout>
  );
}
