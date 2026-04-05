import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Star, ShoppingBag, Verified, Truck } from 'lucide-react';
import { PRODUCTS } from '../constants';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[6]; // Default to Midnight Raven

  return (
    <main className="pt-32 pb-20 max-w-7xl mx-auto px-8">
      {/* Breadcrumb */}
      <nav className="mb-12 flex items-center space-x-2 text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium">
        <Link to="/collection" className="hover:text-primary transition-colors">Collection</Link>
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
                  alt="Detail" 
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
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold rounded-full border border-primary/20">In Stock</span>
              <div className="flex items-center text-secondary">
                {[1, 2, 3, 4].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                <Star className="w-3 h-3" />
                <span className="ml-2 text-xs text-on-surface-variant font-medium">(24 Reviews)</span>
              </div>
            </div>
            <h1 className="text-6xl serif leading-tight text-on-surface mb-4">{product.name}</h1>
            <p className="text-3xl font-light text-primary tracking-tight">${product.price.toLocaleString()}.00</p>
          </header>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Select Weight</label>
              <div className="flex gap-4">
                {['19 oz', '20 oz', '21 oz'].map((w, i) => (
                  <button 
                    key={w} 
                    className={`flex-1 py-4 rounded-lg border transition-all text-sm font-medium ${i === 1 ? 'bg-primary text-on-primary border-primary font-bold shadow-lg shadow-primary/20' : 'bg-surface-container border-outline-variant/20 text-on-surface hover:border-primary'}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full py-5 bg-secondary text-on-secondary font-bold text-lg rounded-lg shadow-xl shadow-secondary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-3">
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Study Collection</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-light italic opacity-80">
              "{product.description} Precision is not an option; it is the standard."
            </p>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-outline-variant/10">
            <div className="flex items-start space-x-3">
              <Verified className="text-tertiary w-5 h-5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Lifetime Warranty</h4>
                <p className="text-[11px] text-on-surface-variant">Guaranteed craftsmanship</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Truck className="text-tertiary w-5 h-5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">Insured Shipping</h4>
                <p className="text-[11px] text-on-surface-variant">White-glove delivery</p>
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
              <h2 className="text-4xl serif mb-4 text-on-surface">The Anatomy of Precision</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed font-light">The technical specs define the player's potential. Every element has been tuned for ultimate energy transfer and minimal deflection.</p>
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
