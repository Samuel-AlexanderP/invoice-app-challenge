export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  /** e.g. “INV‑0001” */
  number: string;
  date: string; // ISO string, e.g. '2025-07-09'
  customer: string;
  products: Product[];
  total: number;
}

// export interface Product {
//   id: string;
//   name: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
// }

// export interface Invoice {
//   id: string;

//   invoiceNumber: string;

//   /** YYYY‑MM‑DD */
//   date: string;

//   /** e.g. “John Doe” */
//   customerName: string;

//   products: Product[];

//   /** auto‑calculated sum of all subtotals */
//   totalAmount: number;
// }
