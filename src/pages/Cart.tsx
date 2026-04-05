import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Minus, Plus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';

export const Cart: React.FC = () => {
  const { user, loading: authLoading, signIn } = useFirebase();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'users', user.uid, 'cart'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setCartItems(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/cart`);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const updateQuantity = async (id: string, delta: number) => {
    if (!user) return;
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'cart', id), {
        quantity: newQuantity
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/cart/${id}`);
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'cart', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart/${id}`);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  if (authLoading || loading) return <div className="pt-40 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" /></div>;

  if (!user) {
    return (
      <main className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
        <ShoppingBag className="w-16 h-16 mx-auto text-on-surface-variant/20 mb-6" />
        <h2 className="serif text-3xl mb-4">Vui lòng đăng nhập</h2>
        <p className="text-on-surface-variant mb-8">Bạn cần đăng nhập để xem và quản lý giỏ hàng của mình.</p>
        <button onClick={signIn} className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold uppercase tracking-widest">Đăng Nhập Ngay</button>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
        <ShoppingBag className="w-16 h-16 mx-auto text-on-surface-variant/20 mb-6" />
        <h2 className="serif text-3xl mb-4">Giỏ hàng trống</h2>
        <p className="text-on-surface-variant mb-8">Có vẻ như bạn chưa chọn được sản phẩm nào ưng ý.</p>
        <Link to="/collection" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold uppercase tracking-widest inline-block">Khám Phá Bộ Sưu Tập</Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl serif font-bold text-on-surface tracking-tight mb-2">Giỏ Hàng</h1>
        <div className="flex items-center gap-2 text-on-surface-variant font-sans text-sm uppercase tracking-widest">
          <span>The Study</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-secondary">Lựa Chọn Của Bạn</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="hidden md:grid grid-cols-12 pb-4 border-b border-outline-variant/15 text-on-surface-variant font-sans text-xs uppercase tracking-widest">
            <div className="col-span-6">Sản Phẩm</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Số Lượng</div>
            <div className="col-span-2 text-right">Tổng Cộng</div>
          </div>

          {cartItems.map(item => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pb-8 md:pb-6 border-b border-outline-variant/10">
              <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-surface-container-high rounded-lg overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src={item.image} alt={item.name} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="serif text-xl text-on-surface mb-1">{item.name}</h3>
                  <p className="text-xs text-on-surface-variant font-sans uppercase tracking-tighter">{item.description || item.category}</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                <span className="md:hidden text-xs font-sans uppercase text-on-surface-variant">Giá</span>
                <span className="font-sans text-on-surface">${item.price.toLocaleString()}.00</span>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                <span className="md:hidden text-xs font-sans uppercase text-on-surface-variant">Số Lượng</span>
                <div className="flex items-center bg-surface-container-low rounded px-2 py-1 gap-4 border border-outline-variant/5">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                <span className="md:hidden text-xs font-sans uppercase text-on-surface-variant">Tổng</span>
                <div className="flex items-center gap-4">
                  <span className="serif text-lg text-on-surface">${(item.price * item.quantity).toLocaleString()}.00</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-on-surface-variant hover:text-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link to="/collection" className="inline-flex items-center gap-2 serif text-sm italic text-tertiary hover:text-primary transition-colors border-b border-primary/20 pb-1">
              <ArrowLeft className="w-4 h-4" />
              Quay Lại Cửa Hàng
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-surface-container p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none"></div>
            <h2 className="serif text-2xl font-bold mb-8 relative">Tóm Tắt Đơn Hàng</h2>
            <div className="space-y-6 relative">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Tạm Tính</span>
                <span className="font-sans text-on-surface">${subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Vận Chuyển</span>
                <span className="font-sans text-emerald-200">Miễn Phí</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Thuế Ước Tính</span>
                <span className="font-sans text-on-surface">${taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between items-end mb-8">
                  <span className="serif text-lg">Tổng Cộng</span>
                  <span className="serif text-3xl text-secondary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <button className="w-full py-4 bg-secondary text-on-secondary rounded-lg font-sans font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20">
                  Tiến Hành Thanh Toán
                </button>
                <p className="mt-6 text-center text-[10px] text-on-surface-variant font-sans uppercase tracking-widest leading-relaxed">
                  Giao hàng chuyên nghiệp được đảm bảo cho tất cả các cây cơ Grandmaster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
