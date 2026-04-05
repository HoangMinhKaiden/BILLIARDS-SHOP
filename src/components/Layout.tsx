import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../context/FirebaseContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, cartCount, signIn, signOut } = useFirebase();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Bộ Sưu Tập', path: '/collection' },
    { name: 'Kiến Thức', path: '/insights' },
    ...(user && !isAdmin ? [
      { name: 'Đơn Hàng', path: '/orders' }
    ] : []),
    ...(isAdmin ? [
      { name: 'Sản Phẩm', path: '/admin' },
      { name: 'Giải Đấu', path: '/admin/articles' },
      { name: 'Đơn Hàng', path: '/admin/orders' },
      { name: 'Khách Hàng', path: '/admin/customers' }
    ] : []),
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-background/90 backdrop-blur-md py-4 border-b border-outline-variant/10' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-bold tracking-[0.2em] text-on-surface serif uppercase">GRANDMASTER</span>
          <span className="text-[10px] tracking-[0.5em] text-secondary uppercase font-sans -mt-1">The Study</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] uppercase tracking-[0.2em] font-sans transition-colors hover:text-secondary ${location.pathname === link.path ? 'text-secondary' : 'text-on-surface-variant'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-on-surface-variant hover:text-secondary transition-colors"><Search className="w-5 h-5" /></button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-outline-variant/20" />
                <span className="hidden lg:block text-[10px] uppercase tracking-widest text-on-surface-variant">{profile?.displayName}</span>
              </div>
              <button onClick={signOut} className="text-on-surface-variant hover:text-error transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={signIn} className="text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="hidden lg:block text-[10px] uppercase tracking-widest">Đăng Nhập</span>
            </button>
          )}

          <Link to="/cart" className="relative text-on-surface-variant hover:text-secondary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="md:hidden text-on-surface" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-outline-variant/10 p-8 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg serif text-on-surface hover:text-secondary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest pt-24 pb-12 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
        <div className="md:col-span-4">
          <Link to="/" className="flex flex-col mb-8">
            <span className="text-3xl font-bold tracking-[0.2em] text-on-surface serif uppercase">GRANDMASTER</span>
            <span className="text-xs tracking-[0.5em] text-secondary uppercase font-sans">The Study</span>
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed font-light max-w-sm">
            Nơi hội tụ những tinh hoa của bộ môn Billiards. Chúng tôi cung cấp những thiết bị đẳng cấp thế giới cho những cơ thủ khao khát sự hoàn hảo.
          </p>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-on-surface font-bold mb-8">Khám Phá</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant font-light">
            <li><Link to="/collection" className="hover:text-secondary transition-colors">Bộ Sưu Tập</Link></li>
            <li><Link to="/insights" className="hover:text-secondary transition-colors">Kiến Thức</Link></li>
            <li><Link to="/" className="hover:text-secondary transition-colors">Về Chúng Tôi</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-on-surface font-bold mb-8">Hỗ Trợ</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant font-light">
            <li><Link to="/" className="hover:text-secondary transition-colors">Giao Hàng</Link></li>
            <li><Link to="/" className="hover:text-secondary transition-colors">Bảo Hành</Link></li>
            <li><Link to="/" className="hover:text-secondary transition-colors">Liên Hệ</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-on-surface font-bold mb-8">Kết Nối</h4>
          <div className="flex space-x-6 mb-8">
            <a href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-xs uppercase tracking-widest">Instagram</a>
            <a href="https://www.facebook.com/ofcourse.urcuties/" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-secondary transition-colors text-xs uppercase tracking-widest">Facebook</a>
            <a href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-xs uppercase tracking-widest">Twitter</a>
          </div>
          <div className="p-1 border-b border-outline-variant/30 flex">
            <input type="email" placeholder="Email của bạn" className="bg-transparent border-none focus:ring-0 text-sm flex-grow placeholder:text-on-surface-variant/30" />
            <button className="text-[10px] uppercase tracking-widest font-bold text-secondary">Gửi</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 pt-12 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40">© 2026 Grandmaster Billiards. Bảo lưu mọi quyền.</span>
        <div className="flex space-x-8 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40">
          <a href="#" className="hover:text-on-surface transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-on-surface transition-colors">Điều khoản dịch vụ</a>
        </div>
      </div>
    </footer>
  );
};
