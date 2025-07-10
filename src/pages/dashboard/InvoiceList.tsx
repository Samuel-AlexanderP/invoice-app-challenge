import { useEffect, useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import type { Invoice } from "../../types";
import { useToast } from "../../components/toastContext";

const STORAGE_KEY = "invoices";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    setInvoices(JSON.parse(raw));
  }, [pathname]); // reload on route change

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast("Invoice deleted.", "error");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-primary dark:text-primary-dark font-bold">
          Your Invoices
        </h2>
        <Link
          to="/invoices/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          New Invoice
        </Link>
      </div>
      {invoices.length === 0 ? (
        <p className="text-center text-primary dark:text-primary-dark">
          No invoices found. Create one!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-primaryBg dark:bg-primaryBg-dark border border-border dark:border-border-dark">
            <thead className="bg-tertiaryBg dark:bg-tertiaryBg-dark">
              <tr>
                {["Invoice no.", "Date", "Customer", "Total", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="
                        py-2 px-4 text-left
                        border-b border-border dark:border-border-dark
                        text-secondary dark:text-secondary-dark
                    "
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="
                    hover:bg-secondaryBg hover:dark:bg-secondaryBg-dark
                    transition-colors
                    "
                >
                  <td className="py-2 px-4 border-b border-border dark:border-border-dark text-primary dark:text-primary-dark">
                    {inv.number}
                  </td>
                  <td className="py-2 px-4 border-b border-border dark:border-border-dark text-primary dark:text-primary-dark">
                    {inv.date}
                  </td>
                  <td className="py-2 px-4 border-b border-border dark:border-border-dark text-primary dark:text-primary-dark">
                    {inv.customer}
                  </td>
                  <td className="py-2 px-4 border-b border-border dark:border-border-dark text-primary dark:text-primary-dark">
                    ₱{inv.total.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b border-border dark:border-border-dark space-x-2">
                    <button
                      onClick={() => navigate(`/invoices/${inv.id}/edit`)}
                      className="
                        px-3 py-1 rounded transition-colors
                        bg-yellow-500 hover:bg-yellow-600
                        text-white
                        "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="
                        px-3 py-1 rounded transition-colors
                        bg-red-600 hover:bg-red-700
                        dark:bg-red-500 dark:hover:bg-red-600
                        text-white
                        "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Outlet /> {/* For nested form routes if needed */}
    </div>
  );
}
