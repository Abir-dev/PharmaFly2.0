type Service = {
    img: string;
    title: string;
    desc: string;
  };
  
  const services: Service[] = [
    {
      img: '/vaccination.jpg',
      title: 'Vaccination Supplies',
      desc: 'Consult our experts for advice on proper vaccination to improve your health. Fast, reliable delivery at your doorstep.'
    },
    {
      img: '/blood.jpg',
      title: 'Blood Supplies',
      desc: 'Get the required blood group delivered safely and quickly to your location.'
    },
    {
      img: '/first-aid.jpg',
      title: 'First Aid Supplies',
      desc: 'Convenient, fast, and precise delivery of essential medications and first aid items.'
    }
  ];
  
  const ServicesSection: React.FC = () => (
    <section className="features-section" id="features">
      <h1 className="animated-text" style={{ color: "#CAF0F8", textAlign: "center", marginBottom: "2rem" }}>Our Services</h1>
      <div className="service-container">
        {services.map((service, idx) => (
          <div className="service-card" key={idx}>
            <img src={service.img} alt={service.title} className="service-image" />
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            {/* <a href="#" className="button animated-button">Explore</a> */}
          </div>
        ))}
      </div>
    </section>
  );
  
  export default ServicesSection;