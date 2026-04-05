import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Minus, Plus, Trash2, Loader2, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { formatCurrency } from '../utils/format';

export const Cart: React.FC = () => {
  const { user, loading: authLoading, signIn } = useFirebase();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

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
  const total = subtotal;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'contact'>('cod');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (paymentMethod === 'cod') {
      if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
        setCheckoutError('Vui lòng nhập đầy đủ thông tin giao hàng.');
        return;
      }
    }

    setIsCheckingOut(true);
    console.log("Starting checkout process...", { paymentMethod, shippingInfo, total });
    try {
      const orderData = {
        userId: user!.uid,
        userEmail: user!.email,
        items: cartItems,
        total: total,
        paymentMethod: paymentMethod,
        shippingInfo: paymentMethod === 'cod' ? shippingInfo : null,
        status: 'pending',
        trackingNumber: '',
        createdAt: new Date().toISOString()
      };

      console.log("Order data prepared:", orderData);

      // Create order
      const ordersRef = collection(db, 'orders');
      const orderDoc = await addDoc(ordersRef, orderData);
      console.log("Order created with ID:", orderDoc.id);

      // Update customer info
      console.log("Updating customer info for UID:", user!.uid);
      const customerRef = doc(db, 'customers', user!.uid);
      const customerDoc = await getDoc(customerRef);
      
      const currentTotalOrders = customerDoc.exists() ? (customerDoc.data()?.totalOrders || 0) : 0;
      const currentTotalSpent = customerDoc.exists() ? (customerDoc.data()?.totalSpent || 0) : 0;

      await setDoc(customerRef, {
        uid: user!.uid,
        email: user!.email,
        displayName: user!.displayName || shippingInfo.name,
        lastShippingInfo: paymentMethod === 'cod' ? shippingInfo : null,
        lastOrderAt: new Date().toISOString(),
        totalOrders: currentTotalOrders + 1,
        totalSpent: currentTotalSpent + total
      }, { merge: true });
      console.log("Customer info updated.");

      // Clear cart
      console.log("Clearing cart items...");
      for (const item of cartItems) {
        await deleteDoc(doc(db, 'users', user!.uid, 'cart', item.id));
      }
      console.log("Cart cleared.");

      setCheckoutSuccess(true);
    } catch (error) {
      console.error("Checkout error:", error);
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (authLoading || loading) return <div className="pt-40 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" /></div>;

  if (checkoutSuccess) {
    return (
      <main className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="serif text-4xl mb-4">Cảm ơn bạn!</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          {paymentMethod === 'cod' 
            ? 'Đơn hàng của bạn đã được tiếp nhận. Chúng tôi sẽ sớm liên hệ để xác nhận và giao hàng.' 
            : 'Yêu cầu của bạn đã được gửi đi. Chúng tôi sẽ liên hệ qua SĐT 0768139513 để sắp xếp lịch hẹn.'}
        </p>
        <Link to="/collection" className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold uppercase tracking-widest inline-block">Tiếp Tục Mua Sắm</Link>
      </main>
    );
  }

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
                <span className="font-sans text-on-surface">{formatCurrency(item.price)}</span>
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
                  <span className="serif text-lg text-on-surface">{formatCurrency(item.price * item.quantity)}</span>
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
                <span className="font-sans text-on-surface">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Vận Chuyển</span>
                <span className="font-sans text-emerald-200">Miễn Phí</span>
              </div>
              
              <div className="pt-6 border-t border-outline-variant/20">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-4 block">Phương Thức Thanh Toán</label>
                <div className="space-y-3">
                  <button 
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full p-4 rounded-lg border flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">Thanh toán khi nhận hàng (COD)</span>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(233,193,118,0.6)]"></div>}
                  </button>
                  
                  {paymentMethod === 'cod' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2"
                    >
                      <input 
                        type="text"
                        placeholder="Họ và tên người nhận"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-4 py-2 text-sm focus:border-secondary transition-all"
                      />
                      <input 
                        type="tel"
                        placeholder="Số điện thoại"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-4 py-2 text-sm focus:border-secondary transition-all"
                      />
                      <textarea 
                        placeholder="Địa chỉ nhận hàng"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-4 py-2 text-sm focus:border-secondary transition-all resize-none"
                        rows={2}
                      />
                    </motion.div>
                  )}

                  <button 
                    onClick={() => setPaymentMethod('contact')}
                    className={`w-full p-4 rounded-lg border flex flex-col items-start gap-1 transition-all ${paymentMethod === 'contact' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest">Liên hệ xem trực tiếp</span>
                      {paymentMethod === 'contact' && <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(233,193,118,0.6)]"></div>}
                    </div>
                    <span className="text-[10px] opacity-70">Hotline: 0768139513</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between items-end mb-8">
                  <span className="serif text-lg">Tổng Cộng</span>
                  <span className="serif text-3xl text-secondary">{formatCurrency(total)}</span>
                </div>
                {checkoutError && (
                  <p className="mb-4 text-xs text-error font-bold text-center">{checkoutError}</p>
                )}
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-secondary text-on-secondary rounded-lg font-sans font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    paymentMethod === 'cod' ? 'Đặt Hàng Ngay' : 'Gửi Yêu Cầu Liên Hệ'
                  )}
                </button>
                <p className="mt-6 text-center text-[10px] text-on-surface-variant font-sans uppercase tracking-widest leading-relaxed">
                  {paymentMethod === 'cod' 
                    ? 'Giao hàng chuyên nghiệp được đảm bảo cho tất cả các cây cơ Grandmaster.' 
                    : 'Chúng tôi sẽ liên hệ với bạn qua SĐT 0768139513 để sắp xếp buổi xem sản phẩm trực tiếp.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
