import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CategoryGrid from './components/CategoryGrid'
import FlashSaleSection from './components/FlashSaleSection'
import ProductGrid from './components/ProductGrid'
import BottomNavigation from './components/BottomNavigation'
import CartView from './components/CartView'
import Checkout from './components/Checkout'
import AuthModal from './components/AuthModal'
import AccountProfile from './components/AccountProfile'
import AddressManager from './components/AddressManager'
import OrderTracking from './components/OrderTracking'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
          {currentPage === 'home' && (
            <>
              <Header onCartClick={() => setShowCart(true)} />
              <CategoryGrid />
              <FlashSaleSection />
              <ProductGrid />
            </>
          )}

          {currentPage === 'account' && <AccountProfile />}
          {currentPage === 'addresses' && <AddressManager />}
          {currentPage === 'orders' && <OrderTracking />}
          {currentPage === 'admin' && <AdminDashboard />}

          <BottomNavigation 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onCartClick={() => setShowCart(true)}
          />

          {showCart && (
            <CartView 
              onClose={() => setShowCart(false)}
              onCheckout={() => {
                setShowCart(false)
                setShowCheckout(true)
              }}
            />
          )}

          {showCheckout && (
            <Checkout onClose={() => setShowCheckout(false)} />
          )}

          {showAuth && (
            <AuthModal onClose={() => setShowAuth(false)} />
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
