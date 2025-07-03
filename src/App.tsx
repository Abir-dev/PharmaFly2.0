import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import EcommerceHeader from './components/ecommerce/EcommerceHeader';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomeSection from './components/WelcomeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import HoursSection from './components/HoursSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { FloatingDockNav } from './components/FloatingDockNav';
import Header from './components/Header';
import LoginPageOld from './components/LoginPage';

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
  const isEcommerceRoute = location.pathname.startsWith('/ecommerce') || 
                          location.pathname === '/products' || 
                          location.pathname === '/cart' || 
                          location.pathname === '/checkout' ||
                          location.pathname === '/signup' ||
                          location.pathname === '/ecommerce' ||
                          location.pathname.startsWith('/product/');
  


  return (
    <AuthProvider>
      <CartProvider>
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
              <Route path="/signup" element={<SignupPage />} />
              {/* Add more e-commerce routes here */}
            </Routes>
          </>
        ) : (
          // Original layout
          <>
            {!isLogin && <Header />}
            {!isLogin && <FloatingDockNav />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPageOld />} />
              {/* Future pages: */}
              {/* <Route path="/about" element={<AboutPage />} /> */}
            </Routes>
            {!isLogin && <Footer />}
          </>
        )}
      </CartProvider>
    </AuthProvider>
  );
};

export default App;