import { Link } from 'react-router-dom';

const WelcomeSection: React.FC = () => (
    <section className="welcome-section" id="info">
      <h2>Access</h2>
      <h2>Affordable</h2>
      <h1>& FASTER</h1>
      <h2>Medicines Today</h2>
      <p>Get essential medications and health care items from your trusted pharmacy in Chaulpatty Road Beliaghata Kulia, WB, India.</p>
      <Link to="/products">
        <button>Shop Now</button>
      </Link>
    </section>
  );
  
  export default WelcomeSection;