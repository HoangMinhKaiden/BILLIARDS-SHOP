import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { PRODUCTS } from '../constants';

export const Cart: React.FC = () => {
  const cartItems = [
    { ...PRODUCTS[6], qty: 1 },
    { id: 'chalk', name: 'Kamui Chalk', price: 28, description: '0.98 Beta / Blue', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2fzlIAz5hn6JmKOTCG_rduxlnoycvkMpDtMxx0nR4fb7vRQE3kX4YfKO16kCuVqM3RhVX1mf7Eds4f8TIykahmvKR270x5C8yaDY4PGizJrdB3F6x2ymEMG88-g71gH1HFhbdKKnZUdu3O13bhYNp6UYTOqKlwEk_GHpCvGye9jb-5UDQMiL3xMgrpPRnDpXY8dGLIsCetf9ISCH_WgdiCW4jEOEdo0fH0bZ_J85bHNk8X2rLvBukvmr7oV3RS2so4VBIrIRMpHHF', qty: 2 },
    { id: 'case', name: 'Predator Hard Case', price: 340, description: 'Roadline 2x2 / Carbon', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAITLUlbxELXgUzvp3J5fZEJWOTIjoepKWLPoZQRXrhzNgekiKGQDnt2cGEBSl9NDnJQ-2O4PfabpRNaBleKkFfdlRQUedL8NDyiJYELEKl_CDgmh05vLiuru_Tq229xiauRB3H6Icd5hawBDqoOoIqCFUEXt4zuwHnSigPWwR31jW1rwSFiigKBlH2COKdeyMRsqLDFjassBD6pJ9E94q23P4vAbFRI2SRbz9bYscHQGhfqDByPEWjKNe-nsqmRprmY3bek-rtF5N-', qty: 1 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl serif font-bold text-on-surface tracking-tight mb-2">Shopping Cart</h1>
        <div className="flex items-center gap-2 text-on-surface-variant font-sans text-sm uppercase tracking-widest">
          <span>The Study</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-secondary">Your Selection</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="hidden md:grid grid-cols-12 pb-4 border-b border-outline-variant/15 text-on-surface-variant font-sans text-xs uppercase tracking-widest">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {cartItems.map(item => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pb-8 md:pb-6 border-b border-outline-variant/10">
              <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-surface-container-high rounded-lg overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src={item.image} alt={item.name} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="serif text-xl text-on-surface mb-1">{item.name}</h3>
                  <p className="text-xs text-on-surface-variant font-sans uppercase tracking-tighter">{item.description}</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                <span className="md:hidden text-xs font-sans uppercase text-on-surface-variant">Price</span>
                <span className="font-sans text-on-surface">${item.price.toLocaleString()}.00</span>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                <span className="md:hidden text-xs font-sans uppercase text-on-surface-variant">Qty</span>
                <div className="flex items-center bg-surface-container-low rounded px-2 py-1 gap-4 border border-outline-variant/5">
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                <span className="md:hidden text-xs font-sans uppercase text-on-surface-variant">Total</span>
                <span className="serif text-lg text-on-surface">${(item.price * item.qty).toLocaleString()}.00</span>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link to="/collection" className="inline-flex items-center gap-2 serif text-sm italic text-tertiary hover:text-primary transition-colors border-b border-primary/20 pb-1">
              <ArrowLeft className="w-4 h-4" />
              Return to Gallery
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-surface-container p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none"></div>
            <h2 className="serif text-2xl font-bold mb-8 relative">Order Summary</h2>
            <div className="space-y-6 relative">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Subtotal</span>
                <span className="font-sans text-on-surface">${subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Shipping</span>
                <span className="font-sans text-emerald-200">Complimentary</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-xs uppercase tracking-widest">Est. Taxes</span>
                <span className="font-sans text-on-surface">${taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between items-end mb-8">
                  <span className="serif text-lg">Total</span>
                  <span className="serif text-3xl text-secondary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <button className="w-full py-4 bg-secondary text-on-secondary rounded-lg font-sans font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20">
                  Proceed to Checkout
                </button>
                <p className="mt-6 text-center text-[10px] text-on-surface-variant font-sans uppercase tracking-widest leading-relaxed">
                  Insured White-Glove delivery included for all Grandmaster Cues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
