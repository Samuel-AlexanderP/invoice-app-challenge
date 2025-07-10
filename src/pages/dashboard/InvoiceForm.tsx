import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import type { Invoice, Product } from "../../types";
import { v4 as uuid } from "uuid";
import { InputField } from "../../components/InputField";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

const STORAGE_KEY = "invoices";

// create a new empty product
const createEmptyProduct = (): Product => ({
  id: uuid(),
  name: "",
  quantity: 1,
  price: 0,
  subtotal: 0,
});

type ProductField = "name" | "quantity" | "price"; // product fields

// Component for a single product row
function ProductRow({
  product,
  index,
  errors,
  onChange,
  onRemove,
  disableRemove,
}: {
  product: Product;
  index: number;
  errors: Record<string, string>;
  onChange: (id: string, field: ProductField, value: string | number) => void;
  onRemove: (id: string) => void;
  disableRemove: boolean;
}) {
  const { id, name, quantity, price, subtotal } = product;
  const errorName = errors[`prod-name-${index}`];
  const errorQty = errors[`prod-qty-${index}`];
  const errorPrice = errors[`prod-price-${index}`];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-10 gap-2 items-center bg-tertiaryBg dark:bg-tertiaryBg-dark p-2 rounded-lg">
      <div className="sm:col-span-3">
        <InputField
          id={`prod-name-${index}`}
          label="Product"
          type="text"
          value={name}
          onChange={(e) => onChange(id, "name", e.target.value)}
          error={!!errorName}
          errorText={errorName}
          required
          autoComplete="off"
        />
      </div>
      <div className="sm:col-span-2">
        <InputField
          id={`prod-qty-${index}`}
          label="Qty"
          type="number"
          placeholder="0"
          value={quantity === 0 ? "" : quantity}
          onChange={(e) => onChange(id, "quantity", Number(e.target.value))}
          error={!!errorQty}
          errorText={errorQty}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <InputField
          id={`prod-price-${index}`}
          label="Price"
          type="number"
          placeholder="0"
          value={price === 0 ? "" : price}
          onChange={(e) => onChange(id, "price", Number(e.target.value))}
          error={!!errorPrice}
          errorText={errorPrice}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-secondary dark:text-secondary-dark">
          Subtotal
        </label>
        <div className="flex w-full px-3 py-2 rounded bg-tertiaryBg dark:bg-tertiaryBg-dark text-primary dark:text-primary-dark overflow-x-auto hide-scrollbar h-[42px]">
          <span className="whitespace-nowrap">₱ {subtotal.toFixed(2)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        disabled={disableRemove}
        className={`self-center flex items-center text-red-600 hover:text-red-800 transition ${
          disableRemove ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title="Remove product"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
}

// Main InvoiceForm component
export default function InvoiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // state hooks
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [customer, setCustomer] = useState("");
  const [products, setProducts] = useState<Product[]>([createEmptyProduct()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // load existing invoice
  useEffect(() => {
    if (!id) return;
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Invoice[];
    const existing = stored.find((inv) => inv.id === id);
    if (existing) {
      setNumber(existing.number);
      setDate(existing.date);
      setCustomer(existing.customer);
      setProducts(existing.products);
    }
  }, [id]);

  // calculate total
  const total = products.reduce((sum, p) => sum + p.subtotal, 0);

  // update product fields
  const updateProduct = (
    pid: string,
    field: ProductField,
    raw: string | number
  ) => {
    setProducts((list) =>
      list.map((p) => {
        if (p.id !== pid) return p;
        const updated = { ...p };
        if (field === "quantity" || field === "price") {
          const num =
            typeof raw === "number" ? raw : parseFloat(String(raw)) || 0;
          updated[field] = num;
          updated.subtotal = updated.quantity * updated.price;
        } else {
          // field is "name"
          updated[field] = String(raw);
        }
        return updated;
      })
    );
  };

  const addProduct = () =>
    setProducts((prev) => [...prev, createEmptyProduct()]);
  const removeProduct = (pid: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== pid));

  // validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!number.trim()) errs.number = "Invoice # is required.";
    if (!customer.trim()) errs.customer = "Customer name is required.";
    products.forEach((p, idx) => {
      if (!p.name) errs[`prod-name-${idx}`] = "Required";
      if (p.quantity < 1) errs[`prod-qty-${idx}`] = "Must be ≥ 1";
      if (p.price < 0) errs[`prod-price-${idx}`] = "Must be ≥ 0";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // submit
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
      ? stored.map((inv) => (inv.id === id ? invoice : inv))
      : [...stored, invoice];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigate("/invoices");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-8 bg-secondaryBg dark:bg-secondaryBg-dark text-primary dark:text-primary-dark rounded-lg shadow transition-colors">
        <h2 className="text-2xl font-bold mb-4">
          {id ? "Edit Invoice" : "New Invoice"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="number"
              label="Invoice #"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              error={!!errors.number}
              errorText={errors.number}
              autoComplete="off"
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
                className="w-full px-3 py-2 rounded bg-tertiaryBg dark:bg-tertiaryBg-dark border border-border dark:border-border-dark focus:outline-none focus:ring transition-colors"
              />
            </div>
            <InputField
              id="customer"
              label="Customer"
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              error={!!errors.customer}
              errorText={errors.customer}
              autoComplete="off"
            />
          </div>

          {/* Products section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Products</h3>
            </div>
            <div className="space-y-2">
              {products.map((p, idx) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  index={idx}
                  errors={errors}
                  onChange={updateProduct}
                  onRemove={removeProduct}
                  disableRemove={products.length === 1}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center text-green-600 hover:text-green-800 transition"
          >
            <FaPlusCircle className="mr-1" /> Add Product
          </button>

          {/* Total & Submit */}
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">Total: ₱ {total.toFixed(2)}</div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 dark:bg-accent text-white rounded hover:bg-blue-700 dark:hover:bg-accent-hover transition-colors"
            >
              {id ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
