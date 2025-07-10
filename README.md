# InvoicePro

A **React + TypeScript** mini-project for managing invoices entirely on the frontend. Built with **Vite**, styled using **Tailwind CSS v4**, and includes:

- **Authentication UI** (Register, Login, Logout) using `localStorage`
- **Protected routes** with React Router
- **CRUD interface** for invoices with Create, Read, Update, Delete
- **Persistent storage** in `localStorage`
- **Dynamic product rows**, real-time subtotal & total calculation
- **Form validation** and inline error handling
- **Dark mode** toggle with CSS-first theming
- **Toast notifications** for user feedback

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build and dev server)
- **Tailwind CSS v4** (CSS-first theming via `@theme`)
- **React Router v6** (client-side routing)
- **Headless UI** (transition for toast)
- **React Icons** (Font Awesome icons)

---

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Samuel-AlexanderP/invoice-app-challenge.git
   cd invoice-app-challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment & Configuration**

- Create a `.env` (copy `.env.sample`) at the project root with values like:

  ```dotenv
  # .env.sample
  VITE_APP_NAME=InvoicePro
  VITE_DEFAULT_CURRENCY=₱
  ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open** your browser at `http://localhost:5173`

---

## 📁 Folder Structure

```
src/
├─ components/
│  ├─ InputField.tsx       # Reusable form input
│  ├─ Layout.tsx           # App layout with header/footer
│  ├─ Navbar.tsx           # Responsive navigation with dark toggle
│  ├─ ToastContext.tsx     # Toast provider & hook
│  └─ ...
├─ hooks/
│  └─ useDarkMode.ts       # Dark mode management
├─ pages/
│  ├─ Welcome.tsx
│  ├─ Register.tsx
│  ├─ Login.tsx
│  ├─ dashboard/
│  │  ├─ InvoiceList.tsx
│  │  └─ InvoiceForm.tsx
├─ types.ts                # TypeScript types
├─ App.tsx                 # Root router setup
└─ main.tsx                # Entry, imports index.css
```

---

## ⚙️ Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build locally

## 👨‍💻 Author

Samuel Alexander Prado
