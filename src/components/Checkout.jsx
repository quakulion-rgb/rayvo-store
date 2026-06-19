import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout({ onClose, onPaymentSuccess }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('review'); // 'review' or 'payment'
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call success callback with order data
      if (onPaymentSuccess) {
        onPaymentSuccess({
          items: cartItems,
          totalAmount: getCartTotal(),
          deliveryAddress,
          paymentStatus: 'completed',
          paymentDate: new Date(),
        });
      }

      clearCart();
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={onClose}
            className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center overflow-y-auto">
      <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold">Checkout</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-4 px-4 py-3 border-b border-gray-200">
          <div
            className={`flex-1 text-center pb-2 border-b-2 transition ${
              currentStep === 'review'
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            Review
          </div>
          <div
            className={`flex-1 text-center pb-2 border-b-2 transition ${
              currentStep === 'payment'
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            Payment
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {currentStep === 'review' ? (
            <div className="space-y-4">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Delivery Address</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={deliveryAddress.fullName}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={deliveryAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setCurrentStep('payment')}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Continue to Payment
              </button>
            </div>
          ) : (
            /* Payment Form */
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={paymentData.expiry}
                    onChange={handlePaymentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-lg font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('review')}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
