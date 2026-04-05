import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const Collection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="pt-32 pb-20 max-w-[1600px] mx-auto px-8 flex gap-12">
      {/* Sidebar Filters */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 space-y-10">
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Loại Cơ</h3>
            <div className="space-y-4">
              {['Cơ Lỗ (Pool)', 'Cơ Carom', 'Cơ Snooker'].map(type => (
                <label key={type} className="flex items-center gap-3 group cursor-pointer">
                  <input className="w-4 h-4 rounded-sm border-outline-variant bg-surface-container-low text-primary focus:ring-0 focus:ring-offset-0 transition-colors" type="checkbox"/>
                  <span className="text-on-surface-variant group-hover:text-on-surface text-sm font-medium transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Khoảng Giá</h3>
            <input className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" type="range"/>
            <div className="flex justify-between mt-4 text-[10px] font-sans text-on-surface-variant">
              <span>$500</span>
              <span>$5,000+</span>
            </div>
          </div>
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Thương Hiệu</h3>
            <div className="space-y-4">
              {['Lucasi', 'Predator', 'Mezz'].map(brand => (
                <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                  <input className="w-4 h-4 border-outline-variant bg-surface-container-low text-secondary focus:ring-0 focus:ring-offset-0" name="brand" type="radio"/>
                  <span className="text-on-surface-variant group-hover:text-on-surface text-sm font-medium transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-primary/60 mb-6">Trọng Lượng</h3>
            <div className="grid grid-cols-2 gap-2">
              {['19oz', '20oz', '21oz'].map(w => (
                <button key={w} className="py-2 px-4 bg-surface-container border border-outline-variant/10 text-xs hover:border-secondary/50 transition-colors rounded">{w}</button>
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
            <span>Đang hiển thị {products.length} kết quả</span>
            <div className="h-px w-12 bg-outline-variant/30"></div>
            <select className="bg-transparent border-none focus:ring-0 text-on-surface cursor-pointer">
              <option>Sắp xếp: Mới nhất</option>
              <option>Giá: Thấp đến Cao</option>
              <option>Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-6" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải bộ sưu tập...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
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
                      <button className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-sans text-xs uppercase tracking-widest font-bold shadow-xl active:scale-95 transition-all">Thêm Vào Giỏ</button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="serif text-xl group-hover:text-primary transition-colors">{product.name}</h3>
                      <span className="serif text-lg text-secondary">${product.price.toLocaleString()}</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest">{product.brand} • {product.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-24 flex items-center justify-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold text-xs">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary transition-colors font-bold text-xs">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary transition-colors font-bold text-xs">3</button>
          <span className="text-on-surface-variant">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
