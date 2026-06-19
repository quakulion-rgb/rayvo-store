import React from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Search Bar */}
      <div className="bg-white px-4 py-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent outline-none flex-1 text-sm"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <MessageCircle size={24} className="text-primary" />
          </button>
        </form>
      </div>

      {/* Promo Banner */}
      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
        🎉 Limited Time Offer: Up to 50% OFF on Selected Items!
      </div>
    </div>
  );
}
