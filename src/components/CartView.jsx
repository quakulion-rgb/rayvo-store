import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartView({ onClose, onCheckout }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center">
      <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">${item.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-300 text-gray-700 rounded flex items-center justify-center hover:bg-gray-400 transition text-xs"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-300 text-gray-700 rounded flex items-center justify-center hover:bg-gray-400 transition text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-xs font-semibold hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                    <p className="text-sm font-bold text-gray-800 mt-auto">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 sticky bottom-0">
            {/* Subtotal */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-800">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>

            {/* Total */}
            <div className="flex justify-between mb-4">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-primary">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
