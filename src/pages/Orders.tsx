import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, ExternalLink, Loader2, ShoppingBag } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { formatCurrency } from '../utils/format';

export const Orders: React.FC = () => {
  const { user, loading: authLoading } = useFirebase();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Orders fetch error:", error);
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Clock className="w-5 h-5 text-on-surface-variant" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      default: return 'Không xác định';
    }
  };

  if (authLoading || loading) return <div className="pt-40 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" /></div>;

  if (!user) return <div className="pt-40 text-center serif text-2xl">Vui lòng đăng nhập để xem đơn hàng.</div>;

  return (
    <main className="pt-32 pb-20 px-8 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="serif text-5xl text-on-surface mb-2">Đơn Hàng Của Bạn</h1>
        <p className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Theo dõi hành trình của những tuyệt tác</p>
      </header>

      {orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-surface-container rounded-3xl border border-outline-variant/10 shadow-inner"
        >
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-on-surface-variant/40" />
          </div>
          <h2 className="serif text-3xl text-on-surface mb-4">Hành trình chưa bắt đầu</h2>
          <p className="text-on-surface-variant font-light mb-10 max-w-md mx-auto">Bạn chưa có đơn hàng nào. Hãy khám phá bộ sưu tập của chúng tôi để tìm thấy những tuyệt tác dành riêng cho bạn.</p>
          <button 
            onClick={() => window.location.href = '/collection'}
            className="bg-secondary text-on-secondary px-10 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-secondary/20"
          >
            Khám phá ngay
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-xl"
            >
              <div className="p-8 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Mã Đơn Hàng</span>
                  <p className="font-mono text-sm text-secondary">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ngày Đặt</span>
                  <p className="text-sm text-on-surface">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Trạng Thái</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-bold text-on-surface">{getStatusText(order.status)}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tổng Thanh Toán</span>
                  <p className="text-xl serif text-primary">{formatCurrency(order.total)}</p>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Sản Phẩm</h3>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-surface-container-low overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-on-surface">{item.name}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-sans text-on-surface">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Thông Tin Giao Hàng</h3>
                  {order.shippingInfo ? (
                    <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
                      <p className="text-sm font-bold text-on-surface">{order.shippingInfo.name}</p>
                      <p className="text-sm text-on-surface-variant">{order.shippingInfo.phone}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{order.shippingInfo.address}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">Liên hệ xem trực tiếp</p>
                  )}

                  {order.trackingNumber && (
                    <div className="pt-4 border-t border-outline-variant/10">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-3">Theo Dõi Vận Đơn</h3>
                      <div className="flex items-center justify-between bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Mã Vận Đơn (J&T/GHTK)</p>
                          <p className="font-mono text-lg text-on-surface">{order.trackingNumber}</p>
                        </div>
                        <a 
                          href={`https://jtexpress.vn/track?type=billcode&billcodes=${order.trackingNumber}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-secondary text-on-secondary rounded-full hover:brightness-110 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
};
