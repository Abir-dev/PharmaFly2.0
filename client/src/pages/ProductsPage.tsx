import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ProductCard from '../components/ecommerce/ProductCard';
import { mockProducts, mockCategories } from '../lib/mockData';
import type { Product, SearchFilters } from '../types';
import { formatPrice } from '../utils';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    price_min: undefined,
    price_max: undefined,
    prescription_required: undefined,
    in_stock: undefined,
    sort_by: 'name',
    sort_order: 'asc',
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Apply filters and search
  const applyFilters = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    if (filters.price_min !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.price_min!);
    }
    if (filters.price_max !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.price_max!);
    }

    // Prescription required filter
    if (filters.prescription_required !== undefined) {
      filtered = filtered.filter(product => product.prescription_required === filters.prescription_required);
    }

    // In stock filter
    if (filters.in_stock !== undefined) {
      filtered = filtered.filter(product => 
        filters.in_stock ? product.stock_quantity > 0 : product.stock_quantity === 0
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sort_by) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filters.sort_order === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    });

    return filtered;
  }, [products, searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(applyFilters.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = applyFilters.slice(startIndex, startIndex + productsPerPage);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.price_min !== undefined) params.set('price_min', filters.price_min.toString());
    if (filters.price_max !== undefined) params.set('price_max', filters.price_max.toString());
    if (filters.prescription_required !== undefined) params.set('prescription_required', filters.prescription_required.toString());
    if (filters.in_stock !== undefined) params.set('in_stock', filters.in_stock.toString());
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.sort_order) params.set('sort_order', filters.sort_order);
    
    setSearchParams(params);
  }, [searchQuery, filters, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      price_min: undefined,
      price_max: undefined,
      prescription_required: undefined,
      in_stock: undefined,
      sort_by: 'name',
      sort_order: 'asc',
    });
    setSearchQuery('');
  };

  const priceRanges = [
    { label: 'Under ₹50', min: 0, max: 50 },
    { label: '₹50 - ₹100', min: 50, max: 100 },
    { label: '₹100 - ₹200', min: 100, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: 'Over ₹500', min: 500, max: undefined },
  ];

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#CAF0F8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#48CAE4] mb-4">
            All Products
          </h1>
          <p className="text-gray-400">
            {applyFilters.length} products found
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-[#00B4D8] rounded-lg text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
          </div>

          {/* View Mode and Filters Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex border border-[#00B4D8] rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'pharma' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'pharma' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="pharmaOutline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64 bg-gray-900 p-6 rounded-lg border border-[#00B4D8] h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#48CAE4]">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm text-[#00B4D8] hover:text-[#48CAE4]"
                >
                  Clear All
                </Button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#CAF0F8] mb-3">Category</h4>
                <div className="space-y-2">
                  {mockCategories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={filters.category === category.name}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-[#00B4D8] focus:ring-[#00B4D8]"
                      />
                      <span className="text-sm text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#CAF0F8] mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.price_min === range.min && filters.price_max === range.max}
                        onChange={() => {
                          handleFilterChange('price_min', range.min);
                          handleFilterChange('price_max', range.max);
                        }}
                        className="text-[#00B4D8] focus:ring-[#00B4D8]"
                      />
                      <span className="text-sm text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prescription Required Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#CAF0F8] mb-3">Prescription</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.prescription_required === false}
                      onChange={(e) => handleFilterChange('prescription_required', e.target.checked ? false : undefined)}
                      className="text-[#00B4D8] focus:ring-[#00B4D8]"
                    />
                    <span className="text-sm text-gray-300">Over the Counter</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.prescription_required === true}
                      onChange={(e) => handleFilterChange('prescription_required', e.target.checked ? true : undefined)}
                      className="text-[#00B4D8] focus:ring-[#00B4D8]"
                    />
                    <span className="text-sm text-gray-300">Prescription Required</span>
                  </label>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#CAF0F8] mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.in_stock === true}
                      onChange={(e) => handleFilterChange('in_stock', e.target.checked ? true : undefined)}
                      className="text-[#00B4D8] focus:ring-[#00B4D8]"
                    />
                    <span className="text-sm text-gray-300">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h4 className="font-medium text-[#CAF0F8] mb-3">Sort By</h4>
                <select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sort_by', sortBy);
                    handleFilterChange('sort_order', sortOrder);
                  }}
                  className="w-full p-2 bg-gray-800 border border-[#00B4D8] rounded text-[#CAF0F8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                </select>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-[#48CAE4] mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                <Button variant="pharmaOutline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="pharmaOutline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'pharma' : 'pharmaOutline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="pharmaOutline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 