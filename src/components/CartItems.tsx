import React, { useState, useEffect } from "react";
import { MinusCircle, PlusCircle, Trash2, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import emailjs from "@emailjs/browser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
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
  window.dispatchEvent(new Event("cartUpdated"));
};

export default function CartItems() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  const updateCartFromStorage = () => {
    const savedCart = getCartFromStorage();
    setCart(savedCart);
  };

  useEffect(() => {
    updateCartFromStorage();

    window.addEventListener("storage", updateCartFromStorage);

    window.addEventListener("cartUpdated", updateCartFromStorage);

    return () => {
      window.removeEventListener("storage", updateCartFromStorage);
      window.removeEventListener("cartUpdated", updateCartFromStorage);
    };
  }, []);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
  });

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      saveCartToStorage(newCart);
      return newCart;
    });

    setMessage(
      change > 0 ? "Item quantity increased" : "Item quantity decreased"
    );
  };

  const removeItem = (productId: string, productName: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      saveCartToStorage(newCart);
      return newCart;
    });
    setMessage(`${productName} removed from cart`);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      const itemsListHTML = cart
        .map(
          (item) => `
        <div class="order-item">
          <p><strong>${item.name}</strong> x ${item.quantity}</p>
          <p>Price per item: ${formatCurrency(item.price)}</p>
          <p>Item total: ${formatCurrency(item.price * item.quantity)}</p>
        </div>
      `
        )
        .join("");

      const templateParams = {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        orderDate: new Date().toLocaleDateString(),
        itemsList: itemsListHTML,
        subtotal: formatCurrency(subtotal),
        tax: formatCurrency(tax),
        total: formatCurrency(total),
        customerName: credentials.name,
        customerEmail: credentials.email,
      };

      await emailjs.send(
        "service_b54cns6",
        "template_jlg0vic",
        templateParams,
        "nKXc5K2Gk8KCBUaPJ"
      );

      setMessage(
        "Order placed successfully! Check your email for confirmation."
      );
      setCart([]);
      saveCartToStorage([]);
      setCredentials({ name: "", email: "" });
    } catch (error) {
      setMessage("There was an error processing your order. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal-cart modal-container modal-overlay">
      <div className="modal-content modal-right flex h-full w-[400px] min-w-[250px] flex-col bg-[#f5f7fe]">
        <div className="w-full">
          <div className="border-b-2 p-5">
            <h3 className="text-lg font-bold text-default-600">
              Shopping Cart {totalItems > 0 && `(${totalItems} items)`}
            </h3>
          </div>
          <button className="close-modal absolute right-5 top-5 p-[3px] text-default-600">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {message && (
          <Alert variant="default" className="m-4 bg-main border-main">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                Your cart is empty
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col p-4 border rounded-lg bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.price)}{" "}
                        each
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(tax)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(total)}
                </span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={credentials.name}
                    onChange={handleCredentialsChange}
                    placeholder="Enter your full name"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleCredentialsChange}
                    placeholder="Enter your email"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
