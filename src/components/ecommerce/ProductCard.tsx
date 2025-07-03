import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Product } from '../../types';
import { formatPrice, calculateDiscountPercentage } from '../../utils';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickView = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    const result = await addToCart(product, 1);
    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    }
  };

  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 bg-black border-[#00B4D8]">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0] || '/first-aid.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge variant="featured" className="text-xs">
              Featured
            </Badge>
          )}
          {product.prescription_required && (
            <Badge variant="prescription" className="text-xs">
              Prescription Required
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={product.stock_quantity > 0 ? "inStock" : "outOfStock"}
            className="text-xs"
          >
            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link to={`/product/${product.id}`}>
              <Button
                variant="pharma"
                size="icon"
                className="h-10 w-10"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="pharma"
              size="icon"
              className="h-10 w-10"
              onClick={handleAddToCart}
              disabled={isLoading || product.stock_quantity === 0}
              title="Add to Cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category */}
          <p className="text-xs text-[#00B4D8] font-medium">
            {product.category}
          </p>

          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-[#CAF0F8] hover:text-[#00B4D8] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-[#48CAE4]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Manufacturer */}
          {product.manufacturer && (
            <p className="text-xs text-gray-500">
              By {product.manufacturer}
            </p>
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          variant="pharma"
          className="w-full"
          onClick={handleAddToCart}
          disabled={isLoading || product.stock_quantity === 0}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#03045E] border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard; 