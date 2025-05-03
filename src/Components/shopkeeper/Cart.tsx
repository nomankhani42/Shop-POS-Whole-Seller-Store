'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  cartUpdateTrigger: boolean;
  onRemoveProductFromCart: (productId: string) => void;
  increase_Quanitity: (productId: string) => void;
  decrease_Quanitity: (productId: string) => void;
}

interface CartAPIItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface GetCartResponse {
  success: boolean;
  cart: CartAPIItem[];
}

const Cart: React.FC<CartProps> = ({
  isExpanded,
  setIsExpanded,
  cartUpdateTrigger,
  onRemoveProductFromCart,
  increase_Quanitity,
  decrease_Quanitity,
}) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);

  const get_cart_data = async () => {
    setLoadingCart(true);
    try {
      const response = await axios.get<GetCartResponse>('/api/cart/get-cart-items');
      const cartFromAPI = response.data.cart;

      const transformedCart: CartItem[] = cartFromAPI.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      setCart(transformedCart);
    } catch (error) {
      toast.error('❌ Error fetching cart items');
      console.error('Error fetching cart items:', error);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    get_cart_data();
  }, [cartUpdateTrigger]);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleString());
    const timer = setInterval(() => {
      setCurrentDate(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName || cart.length === 0) {
      toast.warning("🟡 Customer name is required and cart must not be empty.");
      return;
    }

    const userId = session?.user?.id;
    if (!userId) {
      toast.error("⚠️ Unable to identify the user. Please login again.");
      return;
    }

    try {
      setCheckoutLoading(true);
      const response = await axios.post("/api/check-out", {
        userId, // Send user ID to backend
        customerName,
        customerPhone,
        products: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        netAmount: totalAmount,
        paymentMethod: "cash",
      });

      if (response.status === 200) {
        toast.success("✅ Sale processed successfully!");
        setCustomerName("");
        setCustomerPhone("");
        setCart([]);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ Axios error during checkout:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Something went wrong while processing the sale.");
      } else {
        console.error("❌ Unknown error during checkout:", err);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ width: isExpanded ? 300 : 80 }}
      animate={{ width: isExpanded ? 300 : 80 }}
      className="sticky top-0 right-0 min-h-screen max-h-screen bg-gray-100 shadow-lg flex flex-col border-l border-gray-300 transition-all duration-300"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-[-40px] top-4 z-50 bg-yellow-500 text-white p-2 rounded-full shadow-md"
      >
        {isExpanded ? <FiX size={24} /> : <FiShoppingCart size={24} />}
      </button>

      {isExpanded && (
        <>
          <div className="p-4 bg-yellow-500 text-white text-lg font-semibold flex justify-between">
            <span>Cart</span>
          </div>

          <div className="p-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <div className="text-sm text-gray-600">Date: {currentDate}</div>
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto">
        {isExpanded && loadingCart ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-4 border-yellow-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : isExpanded && cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border-b">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-600">Rs {item.price.toLocaleString('en-PK')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => decrease_Quanitity(item.id)} className="p-1 bg-red-500 text-white rounded">
                  <FiMinus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increase_Quanitity(item.id)} className="p-1 bg-green-500 text-white rounded">
                  <FiPlus size={16} />
                </button>
                <button onClick={() => onRemoveProductFromCart(item.id)} className="p-1 bg-gray-500 text-white rounded">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : isExpanded ? (
          <p className="p-4 text-center text-gray-500">Cart is empty.</p>
        ) : null}
      </div>

      {isExpanded && (
        <div className="p-4 bg-white shadow-lg">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>Rs {totalAmount.toLocaleString('en-PK')}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-3 bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition-all flex justify-center items-center gap-2 disabled:opacity-60"
            disabled={cart.length === 0 || checkoutLoading}
          >
            {checkoutLoading && (
              <span className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></span>
            )}
            Checkout
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
