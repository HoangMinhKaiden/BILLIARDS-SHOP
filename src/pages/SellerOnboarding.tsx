import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, ShieldCheck, TrendingUp, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const SellerOnboarding: React.FC = () => {
  const { user, profile, sellerProfile } = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    phone: '',
    address: ''
  });

  if (!user) {
    return (
      <div className="pt-40 text-center px-8">
        <h2 className="serif text-3xl mb-4">Vui lòng đăng nhập</h2>
        <p className="text-on-surface-variant mb-8">Bạn cần đăng nhập để bắt đầu kinh doanh trên nền tảng của chúng tôi.</p>
      </div>
    );
  }

  if (sellerProfile) {
    return (
      <div className="pt-40 text-center px-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="serif text-4xl mb-4">Yêu cầu đang được xử lý</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Cảm ơn bạn đã đăng ký trở thành Nhà cung cấp. Đội ngũ của chúng tôi đang xem xét hồ sơ của bạn. 
          Trạng thái hiện tại: <span className="font-bold text-secondary uppercase tracking-widest">{sellerProfile.status}</span>
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-surface-container-highest text-on-surface px-8 py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:bg-outline-variant/20 transition-all"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sellerData = {
        uid: user.uid,
        shopName: formData.shopName,
        description: formData.description,
        phone: formData.phone,
        address: formData.address,
        status: 'pending',
        createdAt: new Date().toISOString(),
        rating: 5,
        totalSales: 0
      };

      await setDoc(doc(db, 'sellers', user.uid), sellerData);
      // Success state is handled by the re-render when sellerProfile is updated via onSnapshot in context
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `sellers/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: Info */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-secondary font-sans text-xs uppercase tracking-[0.3em] mb-4 block">Marketplace</span>
            <h1 className="text-6xl md:text-7xl serif font-bold leading-tight text-on-surface mb-6">
              Kinh Doanh Cùng <span className="text-primary">Billiard Heritage</span>
            </h1>
            <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-lg">
              Biến đam mê thành lợi nhuận. Tiếp cận hàng ngàn cơ thủ và người yêu bida trên toàn quốc thông qua nền tảng chuyên nghiệp của chúng tôi.
            </p>
          </motion.div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">Uy Tín Được Đảm Bảo</h3>
                <p className="text-sm text-on-surface-variant font-light">Nền tảng trung gian an toàn, bảo vệ quyền lợi cho cả người mua và người bán.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">Tăng Trưởng Doanh Thu</h3>
                <p className="text-sm text-on-surface-variant font-light">Tiếp cận đúng đối tượng khách hàng mục tiêu trong cộng đồng bida chuyên nghiệp.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface mb-1">Quản Lý Dễ Dàng</h3>
                <p className="text-sm text-on-surface-variant font-light">Hệ thống quản lý sản phẩm và đơn hàng trực quan, hiện đại.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container rounded-3xl p-10 border border-outline-variant/10 shadow-2xl"
        >
          <h2 className="serif text-3xl mb-8">Đăng Ký Nhà Cung Cấp</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Tên Cửa Hàng / Thương Hiệu</label>
              <input 
                required
                value={formData.shopName}
                onChange={e => setFormData({...formData, shopName: e.target.value})}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 focus:border-primary transition-all outline-none"
                placeholder="VD: Bida Pro Shop"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Mô Tả Ngắn</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 focus:border-primary transition-all outline-none min-h-[120px]"
                placeholder="Giới thiệu về cửa hàng của bạn..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Số Điện Thoại</label>
                <input 
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 focus:border-primary transition-all outline-none"
                  placeholder="090..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Địa Chỉ</label>
                <input 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-6 py-4 focus:border-primary transition-all outline-none"
                  placeholder="Thành phố, Quận..."
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 rounded-xl font-bold text-sm uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              Gửi Yêu Cầu Tham Gia
            </button>
            <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">Bằng cách gửi yêu cầu, bạn đồng ý với các điều khoản của chúng tôi.</p>
          </form>
        </motion.div>
      </div>
    </main>
  );
};
