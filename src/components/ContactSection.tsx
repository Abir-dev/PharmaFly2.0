const ContactSection: React.FC = () => (
  <section id="contact">
    <div className="contact-new-container">
      <div className="contact-new-info">
        <h2>Contact Us</h2>
        <ul>
          <li><i className="fa-solid fa-phone"></i> +1 (555) 123-4567</li>
          <li><i className="fa-solid fa-envelope"></i> hello@pharmafly.com</li>
          <li><i className="fa-solid fa-location-dot"></i> 123 Main St, City, Country</li>
        </ul>
        <div className="contact-new-socials">
          <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i className="fa-brands fa-twitter"></i></a>
          <a href="#"><i className="fa-brands fa-instagram"></i></a>
        </div>
      </div>
      <div className="contact-new-form-card">
        <h3>Send us a message</h3>
        <form onSubmit={e => { e.preventDefault(); alert('Message sent!'); }}>
          <div className="contact-new-form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="contact-new-form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="contact-new-form-group">
            <textarea placeholder="Your Message" required rows={4}></textarea>
          </div>
          <button type="submit" className="contact-new-btn">Send</button>
        </form>
      </div>
    </div>
  </section>
);

export default ContactSection;