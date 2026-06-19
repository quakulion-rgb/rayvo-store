import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout({ onClose, onPaymentSuccess }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('review'); // 'review', 'address', or 'payment'
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    region: 'Ashanti',
    city: '',
    street: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mtn'); // 'mtn' or 'telecel'
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    referenceNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const ghanaRegions = [
    'Ashanti',
    'Greater Accra',
    'Central',
    'Eastern',
    'Northern',
    'Savannah',
    'North Eastern',
    'Oti',
    'Upper East',
    'Upper West',
    'Volta',
    'Western',
    'Ahafo',
    'Bono',
    'Bono East',
  ];

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    if (!deliveryAddress.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    if (!deliveryAddress.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    if (!deliveryAddress.street.trim()) {
      alert('Please enter your street address');
      return false;
    }
    if (!deliveryAddress.city.trim()) {
      alert('Please enter your city');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (!paymentData.phoneNumber.trim()) {
      setPaymentError('Please enter your mobile money phone number');
      return false;
    }
    
    // Validate Ghana phone numbers (starts with 0, 10 digits)
    if (!/^0[0-9]{9}$/.test(paymentData.phoneNumber)) {
      setPaymentError('Please enter a valid Ghana phone number (e.g., 0201234567)');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentError('');
    
    if (!validatePayment()) {
      return;
    }

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
          paymentMethod,
          paymentPhone: paymentData.phoneNumber,
          paymentDate: new Date(),
        });
      }

      clearCart();
      onClose();
    } catch (error) {
      setPaymentError('Payment processing failed. Please try again.');
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
      <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto flex flex-col">
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
        <div className="flex gap-2 px-4 py-3 border-b border-gray-200 sticky top-14 bg-white">
          <div
            className={`flex-1 text-center pb-2 border-b-2 transition text-xs md:text-sm ${
              currentStep === 'review'
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            Review
          </div>
          <div
            className={`flex-1 text-center pb-2 border-b-2 transition text-xs md:text-sm ${
              currentStep === 'address'
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            Address
          </div>
          <div
            className={`flex-1 text-center pb-2 border-b-2 transition text-xs md:text-sm ${
              currentStep === 'payment'
                ? 'border-primary text-primary font-semibold'
                : 'border-gray-200 text-gray-500'
            }`}
          >
            Payment
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          {currentStep === 'review' && (
            <div className="space-y-4">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-semibold text-gray-800">
                        GHS {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">GHS {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-primary">GHS {getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setCurrentStep('address')}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Continue to Address
              </button>
            </div>
          )}

          {currentStep === 'address' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">Delivery Address (Ghana)</h3>

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={deliveryAddress.fullName}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (e.g., 0201234567)"
                value={deliveryAddress.phone}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <select
                name="region"
                value={deliveryAddress.region}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {ghanaRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="city"
                placeholder="City (e.g., Accra, Kumasi, Tema)"
                value={deliveryAddress.city}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address / House Number"
                value={deliveryAddress.street}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                name="zipCode"
                placeholder="Postal Code (Optional)"
                value={deliveryAddress.zipCode}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep('review')}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => validateAddress() && setCurrentStep('payment')}
                  className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  {/* MTN Payment Option */}
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition" style={{borderColor: paymentMethod === 'mtn' ? '#FF6B35' : '#e5e7eb', backgroundColor: paymentMethod === 'mtn' ? '#FF6B35' : 'transparent'}}>
                    <input
                      type="radio"
                      value="mtn"
                      checked={paymentMethod === 'mtn'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="ml-3 flex-1">
                      <p className={`font-bold text-sm ${paymentMethod === 'mtn' ? 'text-white' : 'text-gray-800'}`}>
                        MTN Mobile Money
                      </p>
                      <p className={`text-xs ${paymentMethod === 'mtn' ? 'text-white' : 'text-gray-600'}`}>
                        Pay with MTN (*170# or USSD)
                      </p>
                    </div>
                  </label>

                  {/* Telecel Payment Option */}
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition" style={{borderColor: paymentMethod === 'telecel' ? '#FF6B35' : '#e5e7eb', backgroundColor: paymentMethod === 'telecel' ? '#FF6B35' : 'transparent'}}>
                    <input
                      type="radio"
                      value="telecel"
                      checked={paymentMethod === 'telecel'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="ml-3 flex-1">
                      <p className={`font-bold text-sm ${paymentMethod === 'telecel' ? 'text-white' : 'text-gray-800'}`}>
                        Telecel Cash
                      </p>
                      <p className={`text-xs ${paymentMethod === 'telecel' ? 'text-white' : 'text-gray-600'}`}>
                        Pay with Telecel (*110# or USSD)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Phone Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-100 rounded-lg text-gray-600 font-semibold">
                    +233
                  </span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="201234567"
                    value={paymentData.phoneNumber}
                    onChange={handlePaymentChange}
                    maxLength="10"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter the number without country code (10 digits)</p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Payment Instructions:</p>
                <p className="text-xs text-blue-800 mb-2">
                  {paymentMethod === 'mtn' 
                    ? '1. Dial *170# on your MTN phone\n2. Select "Pay bills"\n3. Enter merchant code and amount\n4. Confirm the transaction'
                    : '1. Dial *110# on your Telecel phone\n2. Select "Make payment"\n3. Follow the prompts\n4. Confirm the transaction'}
                </p>
                <p className="text-xs text-blue-800">We will confirm your payment automatically.</p>
              </div>

              {/* Payment Amount Summary */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-sm font-semibold text-gray-800">GHS {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-semibold text-primary">
                    {paymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Telecel Cash'}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {paymentError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing Payment...' : `Pay GHS ${getCartTotal().toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
