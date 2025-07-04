import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockProducts } from '../lib/mockData';
import type { Product } from '../types';
import { formatPrice, calculateDiscountPercentage } from '../utils';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'composition' | 'dosage' | 'reviews'>('description');

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(() => setProduct(null));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-[#CAF0F8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#48CAE4] mb-4">Product not found</h2>
          <Link to="/products">
            <Button variant="pharma">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    const result = await addToCart(product, quantity);
    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert('Product added to cart successfully!');
    }
  };

  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="hover:text-[#00B4D8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#00B4D8] transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#00B4D8] transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#48CAE4]">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden border border-[#00B4D8]">
              <img
                src={product.images[selectedImage] || '/first-aid.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-[#00B4D8]' 
                        : 'border-gray-700 hover:border-[#00B4D8]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.is_featured && (
                <Badge variant="featured">Featured</Badge>
              )}
              {product.prescription_required && (
                <Badge variant="prescription">Prescription Required</Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">{discountPercentage}% OFF</Badge>
              )}
              <Badge variant={product.stock_quantity > 0 ? "inStock" : "outOfStock"}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#48CAE4]">
              {product.name}
            </h1>

            {/* Category */}
            <p className="text-[#00B4D8] font-medium">
              {product.category}
              {product.subcategory && ` • ${product.subcategory}`}
            </p>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#48CAE4]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Manufacturer */}
            {product.manufacturer && (
              <p className="text-gray-400">
                <span className="font-medium">Manufacturer:</span> {product.manufacturer}
              </p>
            )}

            {/* Stock Info */}
            <div className="bg-gray-900 p-4 rounded-lg border border-[#00B4D8]">
              <p className="text-sm">
                <span className="font-medium">Stock:</span> {product.stock_quantity} units available
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border border-[#00B4D8] rounded-lg">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 hover:bg-[#00B4D8] hover:text-[#03045E] transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock_quantity, prev + 1))}
                    className="px-3 py-2 hover:bg-[#00B4D8] hover:text-[#03045E] transition-colors"
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="pharma"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isLoading || product.stock_quantity === 0}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                    </div>
                  )}
                </Button>
                
                <Button variant="pharmaOutline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button variant="pharmaOutline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-900 rounded-lg border border-[#00B4D8]">
                <Truck className="h-8 w-8 text-[#00B4D8] mx-auto mb-2" />
                <p className="text-sm">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-lg border border-[#00B4D8]">
                <Shield className="h-8 w-8 text-[#00B4D8] mx-auto mb-2" />
                <p className="text-sm">Authentic</p>
              </div>
              <div className="text-center p-4 bg-gray-900 rounded-lg border border-[#00B4D8]">
                <Clock className="h-8 w-8 text-[#00B4D8] mx-auto mb-2" />
                <p className="text-sm">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-[#00B4D8]">
            <nav className="flex space-x-8">
              {[
                { key: 'description', label: 'Description' },
                { key: 'composition', label: 'Composition' },
                { key: 'dosage', label: 'Dosage' },
                { key: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#00B4D8] text-[#00B4D8]'
                      : 'border-transparent text-gray-400 hover:text-[#CAF0F8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'composition' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-[#48CAE4] mb-4">Composition</h3>
                <p className="text-lg">{product.composition || 'Composition information not available.'}</p>
              </div>
            )}

            {activeTab === 'dosage' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-[#48CAE4] mb-4">Dosage Information</h3>
                <p className="text-lg">{product.dosage || 'Dosage information not available.'}</p>
                <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    <strong>Important:</strong> Always consult with a healthcare professional before taking any medication. 
                    Follow the prescribed dosage and do not exceed recommended amounts.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-lg font-medium">4.8 out of 5</span>
                  <span className="text-gray-400">(24 reviews)</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Johnson",
                      rating: 5,
                      comment: "Great product! Works exactly as described. Fast delivery too.",
                      date: "2 days ago"
                    },
                    {
                      name: "Rajesh Kumar",
                      rating: 5,
                      comment: "Authentic medicine, good price. Will order again.",
                      date: "1 week ago"
                    }
                  ].map((review, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg border border-[#00B4D8]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#CAF0F8]">{review.name}</span>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#48CAE4] mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-gray-900 rounded-lg border border-[#00B4D8] overflow-hidden hover:border-[#48CAE4] transition-colors">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || '/first-aid.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#CAF0F8] mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-[#48CAE4] mb-2">
                      {formatPrice(relatedProduct.price)}
                    </p>
                    <Link to={`/product/${relatedProduct.id}`}>
                      <Button variant="pharma" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage; 