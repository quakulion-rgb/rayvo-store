import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function AddressManager({ onClose, addresses = [], onSaveAddress, onDeleteAddress }) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveAddress = async () => {
    if (!formData.fullName || !formData.phone || !formData.street) {
      alert('Please fill in all required fields');
      return;
    }
    await onSaveAddress(formData);
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center">
      <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 sticky top-0 bg-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold">Delivery Addresses</h2>
        </div>

        {/* Addresses List */}
        <div className="p-4 space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-300 rounded-lg p-4 relative"
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
              <p className="font-semibold text-gray-800">{address.fullName}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">
                {address.street}, {address.city}, {address.zipCode}
              </p>
              <p className="text-sm text-gray-600">{address.country}</p>
              <button
                onClick={() => onDeleteAddress(address.id)}
                className="mt-2 text-red-500 text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add New Address */}
        {!isAddingNew ? (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add New Address
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 space-y-3">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Save Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
