import React, { useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    try {
      const cart: CartItem[] = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(totalItems);
    } catch {
      setItemCount(0);
    }
  };

  return (
    <div
      className="relative cursor-pointer select-none text-default-600 hover:text-main"
      data-target=".modal-cart"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none h-6 w-6"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <span className="pointer-events-none absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-main text-xs text-white">
          {itemCount}
        </span>
      )}
    </div>
  );
}
