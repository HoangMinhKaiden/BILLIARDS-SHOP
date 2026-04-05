import React from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ARTICLES } from '../constants';

export const Insights: React.FC = () => {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[716px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover brightness-[0.3]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGCQPYLfMndwWI7NWgli-KQAFM4xvLVweuoF-w1vNocczTxd7y9OUljKGmEj_dsiAjj8IlZzL6HKfs5G6of0e6Vw2T4VBOLgPEzOszSoPb6koBRpYj5CQek5XJ5o9LVLb4CryNS0gwdKw59Ai8dy4rK-TUdmrFr012dp25VctpkvTVv6HWvUScgibkXKA0e-tq3GEMOuHWpVoyKYL3_kajV81Cc7E6omTrWiZwBlxOYaFLp8s2Q3qCj_wNHgXWdwZzmVIgy_RBDCVI"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-secondary mb-4 block">The Study</span>
            <h1 className="text-6xl md:text-8xl serif font-bold text-on-surface leading-tight mb-6">Master the Table</h1>
            <p className="text-xl text-on-surface-variant font-light leading-relaxed mb-8 max-w-lg">
              Techniques, insights, and the silent language of the game. Explore the heritage and precision of master-level billiards.
            </p>
            <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-sans font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all">Start Learning</button>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-outline-variant/20 pb-8 mb-16 gap-8">
          <div>
            <h2 className="text-3xl serif text-on-surface mb-2">Techniques & Insights</h2>
            <p className="text-sm text-on-surface-variant font-sans tracking-wide uppercase">Curated articles for the serious player</p>
          </div>
          <div className="flex flex-wrap gap-6 font-sans text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
            {['All', 'Techniques', 'Equipment', 'Pro Tips', 'Maintenance'].map((cat, i) => (
              <button key={cat} className={`${i === 0 ? 'text-secondary border-b-2 border-secondary' : 'hover:text-on-surface'} pb-1 px-1 transition-colors`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Featured Large Post */}
          <article className="md:col-span-8 group relative overflow-hidden rounded-lg bg-surface-container-low flex flex-col md:flex-row shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="md:w-1/2 overflow-hidden h-80 md:h-auto">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={ARTICLES[0].image}
                alt={ARTICLES[0].title}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.2em] mb-4">{ARTICLES[0].category}</span>
              <h3 className="text-3xl serif mb-4 leading-snug group-hover:text-primary transition-colors">{ARTICLES[0].title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">{ARTICLES[0].excerpt}</p>
              <a className="text-secondary serif italic text-lg inline-flex items-center gap-2 group/link" href="#">
                Read More <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </a>
            </div>
          </article>

          {/* Grid Posts */}
          {ARTICLES.slice(1).map(article => (
            <article key={article.id} className="md:col-span-4 group bg-surface-container rounded-lg p-8 flex flex-col border border-outline-variant/10 hover:border-primary/30 transition-all">
              <div className="aspect-video overflow-hidden rounded-lg mb-6">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.2em] mb-3">{article.category}</span>
              <h3 className="text-xl serif mb-4 leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">{article.excerpt}</p>
              <a className="mt-auto text-on-surface font-sans text-[10px] uppercase tracking-widest border-b border-outline-variant w-max pb-1" href="#">Full Story</a>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-on-secondary font-sans text-xs">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant font-sans text-xs hover:text-on-surface">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant font-sans text-xs hover:text-on-surface">3</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-surface-container-lowest py-24 border-t border-outline-variant/10">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <Mail className="w-12 h-12 text-secondary mx-auto mb-6" />
          <h2 className="text-4xl serif text-on-surface mb-4">Join the Inner Circle</h2>
          <p className="text-on-surface-variant font-light mb-10">Receive exclusive masterclasses, limited edition product drops, and pro-level strategy insights directly to your study.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input className="flex-grow bg-surface-container border-b-2 border-outline-variant focus:border-secondary transition-colors px-6 py-4 text-on-surface focus:ring-0 placeholder:text-on-surface-variant/50" placeholder="Your study email" type="email"/>
            <button className="bg-secondary text-on-secondary px-10 py-4 font-sans font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
};
