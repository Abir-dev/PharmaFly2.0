import { Routes, Route, useLocation } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import HoursSection from './components/HoursSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { FloatingDockNav } from './components/FloatingDockNav';
import Header from './components/Header';
import LoginPage from './components/LoginPage';

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
  return (
    <>
      {!isLogin && <Header />}
      {!isLogin && <FloatingDockNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Future pages: */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
      </Routes>
      {!isLogin && <Footer />}
    </>
  );
};

export default App;