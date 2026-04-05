import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 glass-nav text-emerald-50 z-50 shadow-2xl shadow-emerald-950/50">
      <div className="flex items-center gap-12">
        <Link to="/" className="text-2xl serif italic text-emerald-100">The Grandmaster</Link>
        <div className="hidden md:flex gap-8">
          <Link 
            to="/collection" 
            className={`font-sans text-xs uppercase tracking-widest transition-all duration-300 ${location.pathname === '/collection' ? 'text-amber-200 border-b-2 border-amber-200 pb-1' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            Cues
          </Link>
          <Link 
            to="/accessories" 
            className="text-emerald-100/70 hover:text-emerald-50 transition-all duration-300 font-sans text-xs uppercase tracking-widest"
          >
            Accessories
          </Link>
          <Link 
            to="/tables" 
            className="text-emerald-100/70 hover:text-emerald-50 transition-all duration-300 font-sans text-xs uppercase tracking-widest"
          >
            Tables
          </Link>
          <Link 
            to="/insights" 
            className={`font-sans text-xs uppercase tracking-widest transition-all duration-300 ${location.pathname === '/insights' ? 'text-amber-200 border-b-2 border-amber-200 pb-1' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            About Us
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-100/50 w-4 h-4" />
          <input 
            className="bg-emerald-900/20 border-none rounded-full py-2 pl-10 pr-4 text-xs text-emerald-50 placeholder:text-emerald-100/30 focus:ring-1 focus:ring-emerald-500/50 w-64 transition-all duration-300" 
            placeholder="Search archives..." 
            type="text"
          />
        </div>
        <button className="hover:bg-emerald-800/40 p-2 rounded-full transition-all duration-300 active:scale-95">
          <User className="text-emerald-200 w-5 h-5" />
        </button>
        <Link to="/cart" className="hover:bg-emerald-800/40 p-2 rounded-full transition-all duration-300 active:scale-95 relative">
          <ShoppingCart className="text-emerald-200 w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-amber-200 text-on-secondary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </Link>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="serif text-xl text-emerald-50">The Grandmaster</div>
          <p className="text-xs font-sans text-emerald-100/40 uppercase tracking-widest leading-relaxed">Defining precision through heritage and craftsmanship since 1884.</p>
        </div>
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest text-emerald-100/50 mb-6">Explore</h4>
          <ul className="space-y-3">
            <li><Link to="/collection" className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest">Cues</Link></li>
            <li><Link to="/accessories" className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest">Accessories</Link></li>
            <li><Link to="/tables" className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest">Tables</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest text-emerald-100/50 mb-6">Service</h4>
          <ul className="space-y-3">
            <li><a className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest" href="#">Shipping Policies</a></li>
            <li><a className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest" href="#">Warranty Information</a></li>
            <li><a className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest" href="#">Store Locations</a></li>
            <li><a className="text-emerald-100/40 hover:text-amber-100 transition-colors text-xs uppercase tracking-widest" href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-xs uppercase tracking-widest text-emerald-100/50 mb-6">Newsletter</h4>
          <div className="flex items-center border-b border-emerald-100/20 pb-2">
            <input className="bg-transparent border-none focus:ring-0 text-xs w-full text-emerald-100/50 placeholder:text-emerald-100/20" placeholder="YOUR EMAIL" type="email"/>
            <button className="text-emerald-200">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-20 text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-emerald-100/30">© 2024 The Grandmaster’s Study. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
