import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Loader2, 
  X, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { formatCurrency } from '../utils/format';

export const SellerDashboard: React.FC = () => {
  const { user, sellerProfile, isSeller } = useFirebase();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Cơ Bida',
    brand: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (!user || !sellerProfile) return;

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

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
  }, [user, sellerProfile]);

  if (!user || !sellerProfile) {
    return <div className="pt-40 text-center px-8 serif text-2xl">Vui lòng đăng ký làm Nhà cung cấp để truy cập trang này.</div>;
  }

  if (sellerProfile.status === 'pending') {
    return (
      <div className="pt-40 text-center px-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="serif text-4xl mb-4">Hồ Sơ Đang Chờ Duyệt</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Tài khoản Nhà cung cấp của bạn đang được đội ngũ quản trị viên xem xét. 
          Bạn sẽ có quyền truy cập đầy đủ vào Dashboard sau khi hồ sơ được kích hoạt.
        </p>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        sellerId: user.uid,
        sellerName: sellerProfile.shopName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        specs: []
      };

      await addDoc(collection(db, 'products'), productData);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        category: 'Cơ Bida',
        brand: '',
        description: '',
        image: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-surface-container-lowest">
      {/* Sidebar & Header */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 space-y-2">
            <div className="mb-10 px-4">
              <h2 className="serif text-2xl text-on-surface">{sellerProfile.shopName}</h2>
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Nhà Cung Cấp Chuyên Nghiệp</span>
            </div>
            
            {[
              { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
              { id: 'products', label: 'Sản Phẩm', icon: Package },
              { id: 'orders', label: 'Đơn Hàng', icon: ShoppingBag },
              { id: 'settings', label: 'Cài Đặt Shop', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-sans text-xs uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Main Content Area */}
          <div className="flex-grow space-y-10">
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">+12%</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Doanh Thu</p>
                    <h3 className="text-3xl serif text-on-surface">{formatCurrency(sellerProfile.totalSales * 15000000)}</h3>
                  </div>
                  <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-secondary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">+5</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Đơn Hàng Mới</p>
                    <h3 className="text-3xl serif text-on-surface">{sellerProfile.totalSales}</h3>
                  </div>
                  <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-tertiary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">4.9/5</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Đánh Giá</p>
                    <h3 className="text-3xl serif text-on-surface">{sellerProfile.rating}</h3>
                  </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-surface-container rounded-3xl p-10 border border-outline-variant/10 shadow-sm">
                  <h3 className="serif text-2xl mb-8">Hoạt Động Gần Đây</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-outline-variant/5 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-on-surface-variant" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">Đơn hàng mới từ khách hàng #12345</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">2 giờ trước</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-primary">+ {formatCurrency(2500000)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="serif text-3xl text-on-surface">Danh Sách Sản Phẩm</h3>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" /> Thêm Sản Phẩm
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 right-4">
                          {product.status === 'approved' && <span className="bg-emerald-500 text-white text-[8px] uppercase font-bold px-2 py-1 rounded-full">Đã Duyệt</span>}
                          {product.status === 'pending' && <span className="bg-amber-500 text-white text-[8px] uppercase font-bold px-2 py-1 rounded-full">Chờ Duyệt</span>}
                          {product.status === 'rejected' && <span className="bg-red-500 text-white text-[8px] uppercase font-bold px-2 py-1 rounded-full">Từ Chối</span>}
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-on-surface mb-2 line-clamp-1">{product.name}</h4>
                        <p className="text-primary font-bold mb-6">{formatCurrency(product.price)}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-on-surface-variant hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && !loading && (
                  <div className="text-center py-20 bg-surface-container rounded-3xl border border-dashed border-outline-variant/30">
                    <Package className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                    <p className="text-on-surface-variant font-light">Bạn chưa đăng bán sản phẩm nào.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-surface-container rounded-3xl p-10 border border-outline-variant/10 text-center py-32">
                <ShoppingBag className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                <h3 className="serif text-2xl text-on-surface mb-2">Quản Lý Đơn Hàng</h3>
                <p className="text-on-surface-variant font-light">Tính năng này đang được cập nhật để hỗ trợ thanh toán trực tiếp.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-surface-container rounded-3xl p-10 border border-outline-variant/10">
                <h3 className="serif text-3xl mb-8">Cài Đặt Cửa Hàng</h3>
                <div className="space-y-8 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Tên Cửa Hàng</label>
                    <input defaultValue={sellerProfile.shopName} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Mô Tả</label>
                    <textarea defaultValue={sellerProfile.description} className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none min-h-[120px]" />
                  </div>
                  <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">Lưu Thay Đổi</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden"
            >
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="serif text-2xl">Đăng Sản Phẩm Mới</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Tên Sản Phẩm</label>
                  <input 
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all"
                    placeholder="VD: Cơ Bida Custom Limited"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Giá Bán (VNĐ)</label>
                    <input 
                      required
                      type="number"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all"
                      placeholder="15000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Danh Mục</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all"
                    >
                      <option>Cơ Bida</option>
                      <option>Phụ Kiện</option>
                      <option>Bàn Bida</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Thương Hiệu</label>
                  <input 
                    required
                    value={newProduct.brand}
                    onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all"
                    placeholder="VD: Predator, Mezz..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Link Ảnh Sản Phẩm</label>
                  <div className="flex gap-4">
                    <input 
                      required
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="flex-grow bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all"
                      placeholder="https://..."
                    />
                    <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center overflow-hidden border border-outline-variant/10">
                      {newProduct.image ? <img src={newProduct.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-on-surface-variant/30" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Mô Tả Sản Phẩm</label>
                  <textarea 
                    required
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all min-h-[120px]"
                    placeholder="Thông tin chi tiết về sản phẩm..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-grow py-4 bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-outline-variant/20 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    disabled={submitting}
                    className="flex-grow py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Đăng Sản Phẩm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
