import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import type { Invoice, Product } from "../../types";
import { v4 as uuid } from "uuid";
import { InputField } from "../../components/InputField";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

const STORAGE_KEY = "invoices";

// Utility to create an empty product row
const createEmptyProduct = (): Product => ({
  id: uuid(),
  name: "",
  quantity: 1,
  price: 0,
  subtotal: 0,
});

export default function InvoiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── Form state ──
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [customer, setCustomer] = useState("");
  const [products, setProducts] = useState<Product[]>([createEmptyProduct()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Load existing invoice if editing ──
  useEffect(() => {
    if (id) {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      ) as Invoice[];
      const inv = stored.find((i) => i.id === id);
      if (inv) {
        setNumber(inv.number);
        setDate(inv.date);
        setCustomer(inv.customer);
        setProducts(inv.products);
      }
    }
  }, [id]);

  // ── Calculate total ──
  const total = products.reduce((sum, p) => sum + p.subtotal, 0);

  // ── Handlers for product row changes ──
  const updateProduct = (
    pid: string,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts((curr) =>
      curr.map((p) =>
        p.id === pid
          ? {
              ...p,
              [field]: value,
              subtotal:
                field === "quantity"
                  ? Number(value) * p.price
                  : field === "price"
                  ? p.quantity * Number(value)
                  : p.subtotal,
            }
          : p
      )
    );
  };

  const addProduct = () => {
    setProducts((prev) => [...prev, createEmptyProduct()]);
  };

  const removeProduct = (pid: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== pid));
  };

  // ── Form validation ──
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!number.trim()) errs.number = "Invoice number is required.";
    if (!customer.trim()) errs.customer = "Customer name is required.";
    products.forEach((p, idx) => {
      if (!p.name.trim()) errs[`prod-name-${idx}`] = "Required";
      if (p.quantity < 1) errs[`prod-qty-${idx}`] = "Must be ≥ 1";
      if (p.price < 0) errs[`prod-price-${idx}`] = "Must be ≥ 0";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit handler ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Invoice[];
    const invoice: Invoice = {
      id: id || uuid(),
      number: number.trim(),
      date,
      customer: customer.trim(),
      products,
      total,
    };

    const updated = id
      ? stored.map((i) => (i.id === id ? invoice : i))
      : [...stored, invoice];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigate("/invoices");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto text-primary dark:text-primary-dark bg-secondaryBg dark:bg-secondaryBg-dark transition p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">
          {id ? "Edit Invoice" : "New Invoice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="number"
              label="Invoice #"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              autoComplete="off"
              error={!!errors.number}
              errorText={errors.number}
            />
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium mb-1 text-secondary dark:text-secondary-dark"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full px-3 py-2 rounded 
                  bg-tertiaryBg dark:bg-tertiaryBg-dark
                  text-primary dark:text-primary-dark
                  border border-border dark:border-border-dark
                  focus:outline-none focus:ring
                  focus:ring-blue-300 dark:focus:ring-blue-600
                  transition-colors
                "
              />
            </div>
            <InputField
              id="customer"
              label="Customer"
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              autoComplete="off"
              error={!!errors.customer}
              errorText={errors.customer}
            />
          </div>

          {/* Products */}
          <div>
            <h3 className="flex items-center justify-between font-semibold mb-2">
              Products
            </h3>
            {products.map((p, idx) => (
              <div
                key={p.id}
                className="grid grid-cols-1 sm:grid-cols-10 gap-2 items-center bg-tertiaryBg dark:bg-tertiaryBg-dark p-2 rounded-lg"
              >
                {/* Name */}
                <div className="sm:col-span-3">
                  <InputField
                    id={`prod-name-${idx}`}
                    label="Product Name"
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      updateProduct(p.id, "name", e.target.value)
                    }
                    required
                    autoComplete="off"
                    error={!!errors[`prod-name-${idx}`]}
                    errorText={errors[`prod-name-${idx}`]}
                  />
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2">
                  <InputField
                    id={`prod-qty-${idx}`}
                    label="Qty"
                    type="number"
                    value={p.quantity}
                    onChange={(e) =>
                      updateProduct(p.id, "quantity", Number(e.target.value))
                    }
                    required
                    error={!!errors[`prod-qty-${idx}`]}
                    errorText={errors[`prod-qty-${idx}`]}
                  />
                </div>

                {/* Price */}
                <div className="sm:col-span-2">
                  <InputField
                    id={`prod-price-${idx}`}
                    label="Price"
                    type="number"
                    placeholder="0"
                    value={p.price === 0 ? "" : p.price}
                    onChange={(e) =>
                      updateProduct(p.id, "price", Number(e.target.value))
                    }
                    required
                    error={!!errors[`prod-price-${idx}`]}
                    errorText={errors[`prod-price-${idx}`]}
                  />
                </div>
                {/* Subtotal */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary dark:text-secondary-dark">
                    Subtotal
                  </label>
                  <div
                    className="
                      flex flex-nowrap w-full px-3 py-2 rounded 
                      bg-tertiaryBg dark:bg-tertiaryBg-dark 
                      text-primary dark:text-primary-dark
                      overflow-x-auto hide-scrollbar 
                      h-[42px] transition-colors
                    "
                  >
                    <span className="whitespace-nowrap">
                      ₱ {p.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeProduct(p.id)}
                  disabled={products.length === 1}
                  className="self-center justify-self-center flex items-center mt-4 text-red-600 hover:text-red-800 disabled:opacity-50 transition"
                  title="Remove product"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center text-green-600 hover:text-green-800 transition"
            >
              <FaPlusCircle className="mr-1" />
              Add Product
            </button>
          </div>

          {/* Total */}
          <div className="text-right font-bold text-lg">
            Total: {total.toFixed(2)}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white px-6 py-2 rounded bg-blue-600  hover:bg-blue-700 dark:bg-accent dark:hover:bg-accent-hover transition"
            >
              {id ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
