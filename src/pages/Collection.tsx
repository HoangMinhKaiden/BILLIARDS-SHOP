import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { formatCurrency } from '../utils/format';

import { CATEGORIES } from '../constants';

export const Collection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(200000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  // Extract unique brands from products
  const brands = React.useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);
    return ['All', ...uniqueBrands.sort()];
  }, [products]);

  // Apply filters
  useEffect(() => {
    let result = products.filter(p => p.status === 'approved' || !p.status);

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Price filter
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [products, selectedCategories, selectedBrand, priceRange, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <main className="pt-32 pb-20 max-w-[1600px] mx-auto px-8 flex gap-12">
      {/* Sidebar Filters */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 space-y-10">
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Loại Cơ</h3>
            <div className="space-y-4">
              {CATEGORIES.map(type => (
                <label key={type} className="flex items-center gap-3 group cursor-pointer">
                  <input 
                    className="w-4 h-4 rounded-sm border-outline-variant bg-surface-container-low text-primary focus:ring-0 focus:ring-offset-0 transition-colors" 
                    type="checkbox"
                    checked={selectedCategories.includes(type)}
                    onChange={() => toggleCategory(type)}
                  />
                  <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(type) ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Giá tối đa: {formatCurrency(priceRange)}</h3>
            <input 
              className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" 
              type="range"
              min="0"
              max="200000000"
              step="500000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <div className="flex justify-between mt-4 text-[10px] font-sans text-on-surface-variant">
              <span>0₫</span>
              <span>200M₫+</span>
            </div>
          </div>
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Thương Hiệu</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                  <input 
                    className="w-4 h-4 border-outline-variant bg-surface-container-low text-secondary focus:ring-0 focus:ring-offset-0" 
                    name="brand" 
                    type="radio"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                  />
                  <span className={`text-sm font-medium transition-colors ${selectedBrand === brand ? 'text-secondary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <section className="flex-grow">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-2 block">Bộ Sưu Tập</span>
            <h1 className="serif text-5xl text-on-surface font-bold leading-tight">Cơ Bida Nghệ Nhân</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans text-on-surface-variant">
            <span>Đang hiển thị {filteredProducts.length} kết quả</span>
            <div className="h-px w-12 bg-outline-variant/30"></div>
            <select 
              className="bg-transparent border-none focus:ring-0 text-on-surface cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-6" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải bộ sưu tập...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-on-surface-variant text-lg serif">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
            <button 
              onClick={() => {
                setSelectedCategories([]);
                setSelectedBrand('All');
                setPriceRange(200000000);
              }}
              className="mt-6 text-primary uppercase tracking-widest text-xs font-bold hover:underline"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-surface-container-low mb-6 relative">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <button className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-sans text-xs uppercase tracking-widest font-bold shadow-xl active:scale-95 transition-all">Xem Chi Tiết</button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="serif text-xl group-hover:text-primary transition-colors">{product.name}</h3>
                      <span className="serif text-lg text-secondary">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest">{product.brand} • {product.category}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
