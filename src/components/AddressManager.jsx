import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const GHANA_REGIONS = [
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

export default function AddressManager({ onClose, addresses = [], onSaveAddress, onDeleteAddress }) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    region: 'Greater Accra',
    city: '',
    street: '',
    zipCode: '',
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    if (!formData.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    // Validate Ghana phone numbers (starts with 0, 10 digits)
    if (!/^0[0-9]{9}$/.test(formData.phone)) {
      alert('Please enter a valid Ghana phone number (e.g., 0201234567)');
      return false;
    }
    if (!formData.street.trim()) {
      alert('Please enter your street address');
      return false;
    }
    if (!formData.city.trim()) {
      alert('Please enter your city');
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }
    await onSaveAddress(formData);
    setFormData({
      fullName: '',
      phone: '',
      region: 'Greater Accra',
      city: '',
      street: '',
      zipCode: '',
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
                {address.street}, {address.city}
              </p>
              <p className="text-sm text-gray-600">
                {address.region}, Ghana {address.zipCode && `- ${address.zipCode}`}
              </p>
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
            <h3 className="font-semibold text-gray-800 mb-3">Add Ghana Address</h3>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone (e.g., 0201234567)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            <select
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              {GHANA_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="city"
              placeholder="City (e.g., Accra, Kumasi, Tema)"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            <input
              type="text"
              name="street"
              placeholder="Street Address / House Number"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            <input
              type="text"
              name="zipCode"
              placeholder="Postal Code (Optional)"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
