import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Store, Search, Star, MapPin, Loader2, ArrowRight, MessageCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

export const Shops: React.FC = () => {
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const q = query(collection(db, 'sellers'), where('status', '==', 'active'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shopsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setShops(shopsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sellers');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredShops = shops.filter(shop => 
    shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-2 block">Cộng Đồng</span>
            <h1 className="serif text-5xl text-on-surface font-bold leading-tight">Khám Phá Các Cửa Hàng</h1>
          </div>
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên shop..."
              className="w-full bg-surface-container border border-outline-variant/20 rounded-full pl-12 pr-6 py-4 focus:border-primary transition-all outline-none"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-40 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-6" />
          <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải danh sách cửa hàng...</p>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="py-40 text-center bg-surface-container rounded-3xl border border-dashed border-outline-variant/30">
          <Store className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
          <p className="text-on-surface-variant serif text-xl">Không tìm thấy cửa hàng nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map((shop, idx) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 text-secondary fill-secondary" />
                  <span className="text-[10px] font-bold text-secondary">{shop.rating || 5.0}</span>
                </div>
              </div>
              
              <h3 className="serif text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors">{shop.shopName}</h3>
              <p className="text-on-surface-variant text-sm font-light line-clamp-2 mb-6 min-h-[40px]">
                {shop.description}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  <MapPin className="w-3 h-3" />
                  {shop.address}
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  to={`/collection?seller=${shop.id}`}
                  className="flex-grow flex items-center justify-center gap-2 py-4 bg-surface-container-high text-on-surface rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
                >
                  Sản Phẩm <ArrowRight className="w-4 h-4" />
                </Link>
                {shop.id !== user?.uid && (
                  <button 
                    onClick={() => navigate(`/chat?sellerId=${shop.id}`)}
                    className="px-6 flex items-center justify-center bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-on-secondary transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
};
