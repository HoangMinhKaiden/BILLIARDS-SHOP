import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Star, ShoppingBag, Verified, Truck, Loader2, Share2, MessageCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';
import { formatCurrency } from '../utils/format';
import { ShareButtons } from '../components/ShareButtons';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signIn } = useFirebase();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ ...docSnap.data(), id: docSnap.id });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      signIn();
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      const cartItemRef = doc(db, 'users', user.uid, 'cart', product.id);
      const cartItemSnap = await getDoc(cartItemRef);

      if (cartItemSnap.exists()) {
        await updateDoc(cartItemRef, {
          quantity: (cartItemSnap.data().quantity || 0) + 1
        });
      } else {
        await setDoc(cartItemRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
      navigate('/cart');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart/${product.id}`);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="pt-40 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" /></div>;
  if (!product) return <div className="pt-40 text-center serif text-2xl">Không tìm thấy sản phẩm.</div>;

  return (
    <main className="pt-32 pb-20 max-w-7xl mx-auto px-8">
      {/* Breadcrumb */}
      <nav className="mb-12 flex items-center space-x-2 text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium">
        <Link to="/collection" className="hover:text-primary transition-colors">Bộ Sưu Tập</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-on-surface">{product.name}</span>
      </nav>

      {/* Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          <div className="col-span-2 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-outline-variant/10 cursor-pointer bg-surface-container hover:border-secondary/40 transition-all">
                <img 
                  alt="Chi tiết" 
                  className="w-full h-full object-cover" 
                  src={product.image}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          <div className="col-span-10 relative group">
            <div className="aspect-[3/4] bg-surface-container rounded-xl overflow-hidden shadow-2xl">
              <img 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={product.image}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-5 flex flex-col space-y-10">
          <header>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold rounded-full border border-primary/20">Còn Hàng</span>
              <div className="flex items-center text-secondary">
                {[1, 2, 3, 4].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                <Star className="w-3 h-3" />
                <span className="ml-2 text-xs text-on-surface-variant font-medium">(24 Đánh giá)</span>
              </div>
            </div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-6xl serif leading-tight text-on-surface">{product.name}</h1>
              <div className="pt-4">
                <ShareButtons 
                  title={product.name} 
                  text={`Khám phá ${product.name} tại cửa hàng của chúng tôi!`} 
                  url={window.location.href} 
                />
              </div>
            </div>
            <p className="text-3xl font-light text-primary tracking-tight">{formatCurrency(product.price)}</p>
          </header>

          <div className="space-y-6">
            <div className="pt-4 space-y-4">
              <button 
                onClick={addToCart}
                disabled={addingToCart}
                className="w-full py-5 bg-secondary text-on-secondary font-bold text-lg rounded-lg shadow-xl shadow-secondary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                <span>{addingToCart ? 'Đang Thêm...' : 'Thêm Vào Bộ Sưu Tập'}</span>
              </button>
              {product.sellerId && product.sellerId !== user?.uid && (
                <button 
                  onClick={() => navigate(`/chat?sellerId=${product.sellerId}&productId=${product.id}`)}
                  className="w-full py-4 bg-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-widest rounded-lg border border-outline-variant/20 hover:bg-outline-variant/10 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Trò chuyện với người bán</span>
                </button>
              )}
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Hoặc xem trực tiếp tại cửa hàng</p>
                <a href="tel:0768139513" className="text-secondary font-sans font-bold hover:underline transition-all">Hotline: 0768139513</a>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-light italic opacity-80">
              "{product.description} Sự chính xác không phải là một lựa chọn; đó là tiêu chuẩn."
            </p>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-outline-variant/10">
            <div className="flex items-start space-x-3">
              <Verified className="text-tertiary w-5 h-5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Bảo Hành Trọn Đời</h4>
                <p className="text-[11px] text-on-surface-variant">Cam kết chất lượng thủ công</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="text-tertiary w-5 h-5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Giao Hàng Đảm Bảo</h4>
                <p className="text-[11px] text-on-surface-variant">Vận chuyển chuyên nghiệp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      {product.specs && (
        <section className="mt-32 pt-20 border-t border-outline-variant/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-4xl serif mb-4 text-on-surface">Giải Phẫu Sự Chính Xác</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed font-light">Các thông số kỹ thuật định nghĩa tiềm năng của người chơi. Mọi yếu tố đều được tinh chỉnh để truyền năng lượng tối ưu và giảm thiểu độ lệch.</p>
            </div>
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-12 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-20">
                {product.specs.map(spec => (
                  <div key={spec.label} className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                    <span className="text-sm font-sans uppercase tracking-[0.2em] text-on-surface-variant">{spec.label}</span>
                    <span className="text-2xl serif text-secondary">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
