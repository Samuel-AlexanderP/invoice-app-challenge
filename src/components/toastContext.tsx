// src/components/ToastContext.tsx
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Transition } from "@headlessui/react";

type Toast = { id: string; message: string; type: "success" | "error" };

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      // auto-remove after 3s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(({ id, message, type }) => (
          <Transition
            key={id}
            appear
            show
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <div
              className={`
                max-w-xs px-4 py-2 rounded shadow-lg text-white 
                ${type === "success" ? "bg-green-600" : "bg-red-600"}
              `}
            >
              {message}
            </div>
          </Transition>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
