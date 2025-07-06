import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { ProductsProvider } from './hooks/useProducts';
import EcommerceHeader from './components/ecommerce/EcommerceHeader';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentPage from './pages/PaymentPage';
import WishlistPage from './pages/WishlistPage';
import SettingsPage from './pages/SettingsPage';
import WelcomeSection from './components/WelcomeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import HoursSection from './components/HoursSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { FloatingDockNav } from './components/FloatingDockNav';
import Header from './components/Header';
import AdminPanel from './pages/AdminPanel';

function Home() {
  return (
    <>
      <WelcomeSection />
      <AboutSection />
      <ServicesSection />
      <HoursSection />
      <ContactSection />
    </>
  );
}

const App: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname.toLowerCase() === '/login';
  const isRegister = location.pathname.toLowerCase() === '/register';
  const isEcommerceRoute = location.pathname.startsWith('/ecommerce') || 
                          location.pathname === '/products' || 
                          location.pathname === '/cart' || 
                          location.pathname === '/checkout' ||
                          location.pathname === '/ecommerce' ||
                          location.pathname.startsWith('/product/') ||
                          location.pathname === '/profile' ||
                          location.pathname === '/orders' ||
                          location.pathname === '/wishlist' ||
                          location.pathname === '/settings';
  const isAdminRoute = location.pathname === '/admin';
  


  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          {isEcommerceRoute ? (
            // E-commerce layout
            <>
              <EcommerceHeader />
              <Routes>
                <Route path="/ecommerce" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/test" element={<div className="p-8 text-center text-2xl">Test Route Working!</div>} />
                {/* Add more e-commerce routes here */}
              </Routes>
            </>
          ) : isAdminRoute ? (
            // Admin layout (no header, footer, or floating dock)
            <Routes>
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          ) : isRegister ? (
            // Register layout (no header, footer, or floating dock)
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          ) : (
            // Original layout
            <>
              {!isLogin && !isRegister && <Header />}
              {!isLogin && !isRegister && <FloatingDockNav />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* <Route path="/admin" element={<AdminPanel />} /> */}
                {/* Future pages: */}
                {/* <Route path="/about" element={<AboutPage />} /> */}
              </Routes>
              {!isLogin && !isRegister && <Footer />}
            </>
          )}
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;