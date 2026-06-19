import React, { useState } from 'react';
import { ArrowLeft, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/firebaseService';
import AddressManager from './AddressManager';

export default function AccountProfile({ onClose }) {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [addresses, setAddresses] = useState(userProfile?.addresses || []);
  const [loading, setLoading] = useState(false);

  const handleSaveAddress = async (address) => {
    if (user) {
      try {
        setLoading(true);
        await addressService.addAddress(user.uid, address);
        setAddresses([...addresses, { ...address, id: Date.now() }]);
      } catch (error) {
        console.error('Error saving address:', error);
        alert('Failed to save address. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (user) {
      try {
        setLoading(true);
        await addressService.deleteAddress(user.uid, addressId);
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showAddressManager) {
    return (
      <AddressManager
        onClose={() => setShowAddressManager(false)}
        addresses={addresses}
        onSaveAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center overflow-y-auto">
      <div className="bg-white w-full md:max-w-md rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 sticky top-0 bg-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold">My Account</h2>
        </div>

        {/* Profile Section */}
        <div className="p-4">
          {user ? (
            <>
              {/* User Info */}
              <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-4 rounded-lg mb-4">
                <p className="text-sm opacity-90">Welcome</p>
                <p className="text-lg font-bold">{userProfile?.displayName || user.email}</p>
                <p className="text-xs opacity-75 mt-1">{user.email}</p>
              </div>

              {/* Account Options */}
              <div className="space-y-2 mb-4">
                {/* Address Management */}
                <button
                  onClick={() => setShowAddressManager(true)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <MapPin size={20} className="text-primary flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">Ghana Delivery Addresses</p>
                    <p className="text-xs text-gray-500">{addresses.length} address(es) saved</p>
                  </div>
                </button>

                {/* Order History */}
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-5 h-5 flex items-center justify-center text-primary text-xl flex-shrink-0">📦</div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">Order History</p>
                    <p className="text-xs text-gray-500">View all past orders</p>
                  </div>
                </button>

                {/* Payment Methods */}
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-5 h-5 flex items-center justify-center text-primary text-xl flex-shrink-0">💳</div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">Payment Methods</p>
                    <p className="text-xs text-gray-500">MTN & Telecel Mobile Money</p>
                  </div>
                </button>

                {/* Help & Support */}
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-5 h-5 flex items-center justify-center text-primary text-xl flex-shrink-0">❓</div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">Help & Support</p>
                    <p className="text-xs text-gray-500">Contact our team on WhatsApp</p>
                  </div>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 mt-6"
              >
                <LogOut size={20} /> {loading ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You are not logged in</p>
              <button
                onClick={onClose}
                className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
