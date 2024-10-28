import React, { useState, useEffect } from "react";
import { AlertCircle, MinusCircle, PlusCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AddToCartProps {
  productId: string;
  price: number;
  name: string;
}

const getCartFromStorage = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem("cartItems") || "[]");
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
};

const findItemIndex = (cart: CartItem[], productId: string) => {
  return cart.findIndex((item) => item.id === productId);
};

export default function CartManager(
  { productId, price, name }: AddToCartProps = {
    productId: "1",
    price: 99.99,
    name: "Sample Product",
  }
) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCart = getCartFromStorage();
    setCart(savedCart);
  }, []);

  const currentItem = cart.find((item) => item.id === productId);
  const quantity = currentItem?.quantity || 0;

  const updateCart = (newQuantity: number) => {
    setCart((prevCart) => {
      const itemIndex = findItemIndex(prevCart, productId);
      let newCart: CartItem[];

      if (itemIndex === -1 && newQuantity > 0) {
        newCart = [
          ...prevCart,
          { id: productId, name, price, quantity: newQuantity },
        ];
      } else if (newQuantity === 0 && itemIndex !== -1) {
        newCart = prevCart.filter((item) => item.id !== productId);
      } else if (itemIndex !== -1) {
        newCart = prevCart.map((item, index) =>
          index === itemIndex ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return prevCart;
      }

      saveCartToStorage(newCart);
      window.dispatchEvent(new Event("cartUpdated"));
      return newCart;
    });
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateCart(quantity - 1);
      setMessage(`Removed 1 ${name} from cart`);
    }
  };

  const handleIncrement = () => {
    updateCart(quantity + 1);
    setMessage(`Added 1 ${name} to cart`);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant="default" className="bg-main border-main">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <span className="font-bold text-gray-700">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity === 0}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <MinusCircle className="w-6 h-6" />
          </button>
          <span className="w-8 text-center font-semibold" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Increase quantity"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
