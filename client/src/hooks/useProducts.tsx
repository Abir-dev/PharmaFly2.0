import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../lib/mockData';
import type { Product } from '../types';

interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  refreshProducts: () => Promise<void>;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/products');
      if (response.ok) {
        const apiProducts = await response.json();
        // Use API products if available, otherwise fall back to mock data
        setProducts(apiProducts.length > 0 ? apiProducts : mockProducts);
      } else {
        console.error('Failed to fetch products, using mock data');
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('Error fetching products, using mock data:', error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, refreshProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
}; 