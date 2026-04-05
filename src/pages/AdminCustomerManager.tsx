import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Loader2, Mail, Phone, MapPin, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';
import { Navigate } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export const AdminCustomerManager: React.FC = () => {
  const { isAdmin, loading: authLoading } = useFirebase();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'customers'), orderBy('lastOrderAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setCustomers(customersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'customers');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (authLoading) return <div className="pt-32 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  const filteredCustomers = customers.filter(customer => 
    customer.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastShippingInfo?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-2 block">Quản Trị Viên</span>
          <h1 className="serif text-5xl text-on-surface font-bold leading-tight">Danh Sách Khách Hàng</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <input 
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary transition-all"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải danh sách khách hàng...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-surface-container rounded-xl border border-outline-variant/10">
            <p className="text-on-surface-variant serif text-xl">Không tìm thấy khách hàng nào.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <motion.div 
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 shadow-lg hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  {customer.displayName?.charAt(0).toUpperCase() || <Users className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                  <h3 className="serif text-lg text-on-surface truncate">{customer.displayName || 'Khách hàng ẩn danh'}</h3>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                      <ShoppingBag className="w-3 h-3" /> Đơn Hàng
                    </div>
                    <div className="serif text-xl text-on-surface">{customer.totalOrders || 0}</div>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
                      <DollarSign className="w-3 h-3" /> Tổng Chi
                    </div>
                    <div className="serif text-xl text-primary">{formatCurrency(customer.totalSpent || 0)}</div>
                  </div>
                </div>

                {customer.lastShippingInfo && (
                  <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Phone className="w-4 h-4 opacity-40" /> {customer.lastShippingInfo.phone}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-on-surface-variant leading-relaxed">
                      <MapPin className="w-4 h-4 opacity-40 mt-1" /> {customer.lastShippingInfo.address}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Đơn cuối: {new Date(customer.lastOrderAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
};
