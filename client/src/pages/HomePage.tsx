import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ProductCard from '../components/ecommerce/ProductCard';
import { featuredProducts, categoriesWithProducts } from '../lib/mockData';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/drone.jpg')",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#48CAE4] animated-text">
            MediCart
          </h1>
          <h2 className="text-2xl md:text-4xl mb-4 text-[#ADE8F4]">
            Your Trusted Online Pharmacy
          </h2>
          <p className="text-lg md:text-xl mb-8 text-[#CAF0F8] max-w-2xl mx-auto">
            Get essential medications and health care items delivered to your doorstep. 
            Quality medicines, competitive prices, and reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button variant="pharma" size="lg" className="text-lg px-8 py-4">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="pharmaOutline" size="lg" className="text-lg px-8 py-4">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-[#03045E]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#48CAE4]">Fast Delivery</h3>
              <p className="text-gray-400">Same day delivery in your area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#03045E]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#48CAE4]">Authentic Products</h3>
              <p className="text-gray-400">100% genuine medicines guaranteed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00B4D8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#03045E]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#48CAE4]">24/7 Support</h3>
              <p className="text-gray-400">Round the clock customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#48CAE4]">
              Featured Products
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover our most popular and trusted medications
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="pharmaOutline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#48CAE4]">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Find the right medications for your health needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithProducts.map((category) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-lg bg-gray-900 border border-[#00B4D8] hover:border-[#48CAE4] transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#CAF0F8] group-hover:text-[#00B4D8] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#00B4D8]">
                      {category.products.length} products
                    </span>
                    <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                      <Button variant="pharma" size="sm">
                        Browse
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#48CAE4]">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Trusted by thousands of customers across the country
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                comment: "Excellent service! My medicines were delivered within 2 hours. Highly recommended!",
                location: "Mumbai"
              },
              {
                name: "Rajesh Kumar",
                rating: 5,
                comment: "Authentic products and great prices. The customer support is very helpful.",
                location: "Delhi"
              },
              {
                name: "Priya Sharma",
                rating: 5,
                comment: "Convenient and reliable. I've been ordering from MediCart for months now.",
                location: "Bangalore"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-black border border-[#00B4D8] rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#CAF0F8]">{testimonial.name}</span>
                  <span className="text-sm text-gray-400">{testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#48CAE4]">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of satisfied customers who trust MediCart for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="pharma" size="lg" className="text-lg px-8 py-4">
                Create Account
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="pharmaOutline" size="lg" className="text-lg px-8 py-4">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 