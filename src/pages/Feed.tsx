import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  MessageCircle, 
  ShoppingBag, 
  Store, 
  Clock, 
  ChevronRight,
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { formatCurrency } from '../utils/format';
import { useFirebase } from '../context/FirebaseContext';

export const Feed: React.FC = () => {
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerIdFilter = searchParams.get('seller');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    if (sellerIdFilter) {
      q = query(collection(db, 'products'), where('sellerId', '==', sellerIdFilter), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sellerIdFilter]);

  const filteredProducts = products.filter(p => {
    const isApproved = p.status === 'approved' || !p.status;
    const categoryMatch = activeCategory === 'Tất cả' || p.category === activeCategory;
    return isApproved && categoryMatch;
  });

  const categories = ['Tất cả', ...Array.from(new Set(products.map(p => p.category))).filter(Boolean)];

  return (
    <main className="pt-32 pb-20 bg-surface-container-lowest min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        {/* Feed Header */}
        <header className="mb-12 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-4 block">Marketplace Feed</span>
          <h1 className="serif text-5xl text-on-surface font-bold mb-6">Khám Phá Sản Phẩm</h1>
          
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="py-40 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-6" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang cập nhật bảng tin...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center bg-surface-container rounded-[2rem] border border-dashed border-outline-variant/30">
            <ShoppingBag className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
            <p className="text-on-surface-variant serif text-xl">Chưa có sản phẩm nào trong bảng tin.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredProducts.map((product, idx) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Seller Header */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface leading-tight">{product.sellerName || 'Cửa hàng'}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
                        <Clock className="w-3 h-3" />
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/shops?q=${product.sellerName}`}
                    className="p-3 hover:bg-surface-container-high rounded-2xl transition-colors text-primary"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>

                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6">
                    <span className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-primary shadow-xl">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-1 block">{product.category}</span>
                      <h2 className="serif text-3xl text-on-surface font-bold">{product.name}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-surface-container-high rounded-2xl hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-surface-container-high rounded-2xl hover:text-primary transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 mb-8 font-light">
                    {product.description}
                  </p>

                  <div className="flex gap-4">
                    <Link 
                      to={`/product/${product.id}`}
                      className="flex-grow flex items-center justify-center gap-2 py-5 bg-primary text-on-primary rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                    >
                      Xem Chi Tiết <ChevronRight className="w-4 h-4" />
                    </Link>
                    {product.sellerId !== user?.uid && (
                      <button 
                        onClick={() => navigate(`/chat?sellerId=${product.sellerId}&productId=${product.id}`)}
                        className="px-8 flex items-center justify-center bg-secondary/10 text-secondary rounded-[1.5rem] hover:bg-secondary hover:text-on-secondary transition-all"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
