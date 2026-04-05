import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, Loader2, Edit2, Check, X, Search, User, Phone, MapPin, DollarSign, Tag, FileText, Trash2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';
import { Navigate } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export const AdminOrderManager: React.FC = () => {
  const { isAdmin, loading: authLoading } = useFirebase();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (authLoading) return <div className="pt-32 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const updateTrackingNumber = async (id: string, trackingNumber: string) => {
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'orders', id), { trackingNumber });
      setEditingOrder(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrderToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingInfo?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/20';
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

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-2 block">Quản Trị Viên</span>
          <h1 className="serif text-5xl text-on-surface font-bold leading-tight">Quản Lý Đơn Hàng</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <input 
            type="text"
            placeholder="Tìm kiếm đơn hàng, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary transition-all"
          />
        </div>
      </header>

      <div className="space-y-6">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-20 text-center bg-surface-container rounded-xl border border-outline-variant/10">
            <p className="text-on-surface-variant serif text-xl">Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="p-6 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-mono text-sm text-on-surface">#{order.id.slice(-8).toUpperCase()}</div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer focus:ring-0 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                  </select>
                  <div className="text-right flex items-center gap-4">
                    <button 
                      onClick={() => setOrderToDelete(order)}
                      className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded transition-colors"
                      title="Xóa đơn hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Tổng Cộng</div>
                      <div className="serif text-lg text-primary">{formatCurrency(order.total)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant flex items-center gap-2">
                    <User className="w-3 h-3" /> Khách Hàng
                  </h3>
                  {order.shippingInfo ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-on-surface">
                        <User className="w-4 h-4 opacity-40" /> {order.shippingInfo.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <Phone className="w-4 h-4 opacity-40" /> {order.shippingInfo.phone}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-on-surface-variant leading-relaxed">
                        <MapPin className="w-4 h-4 opacity-40 mt-1" /> {order.shippingInfo.address}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-on-surface-variant italic">Yêu cầu xem trực tiếp</div>
                  )}
                  <div className="text-[10px] text-on-surface-variant/60 font-mono">{order.userEmail}</div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Sản Phẩm ({order.items.length})
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-low overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">{item.name}</p>
                          <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter">x{item.quantity} • {formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking & Actions */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant flex items-center gap-2">
                    <Truck className="w-3 h-3" /> Vận Chuyển
                  </h3>
                  {editingOrder?.id === order.id ? (
                    <div className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Mã vận đơn (J&T/GHTK)"
                        defaultValue={order.trackingNumber}
                        id={`tracking-${order.id}`}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs focus:border-primary transition-all"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateTrackingNumber(order.id, (document.getElementById(`tracking-${order.id}`) as HTMLInputElement).value)}
                          disabled={isSubmitting}
                          className="flex-1 bg-secondary text-on-secondary py-2 rounded text-[10px] uppercase tracking-widest font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Lưu
                        </button>
                        <button 
                          onClick={() => setEditingOrder(null)}
                          className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded text-[10px] uppercase tracking-widest font-bold hover:bg-surface-container-highest transition-all"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mb-1">Mã Vận Đơn</p>
                        <p className="font-mono text-sm text-on-surface">{order.trackingNumber || 'Chưa cập nhật'}</p>
                      </div>
                      <button 
                        onClick={() => setEditingOrder(order)}
                        className="p-2 hover:bg-primary/10 text-primary rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                    <FileText className="w-3 h-3" />
                    <span>Phương thức: {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Liên hệ trực tiếp'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOrderToDelete(null)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-surface-container rounded-2xl shadow-2xl p-8 border border-outline-variant/20"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-error" />
              </div>
              <div>
                <h3 className="serif text-2xl mb-2">Xác Nhận Xóa Đơn Hàng</h3>
                <p className="text-on-surface-variant text-sm">
                  Bạn có chắc chắn muốn xóa đơn hàng <span className="text-on-surface font-bold">#{orderToDelete.id.slice(-8).toUpperCase()}</span>? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 px-6 py-3 rounded-lg font-sans font-bold text-xs tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => deleteOrder(orderToDelete.id)}
                  disabled={isSubmitting}
                  className="flex-1 bg-error text-on-error px-6 py-3 rounded-lg font-sans font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Xác Nhận Xóa
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};
