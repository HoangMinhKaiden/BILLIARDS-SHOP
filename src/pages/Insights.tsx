import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, ChevronLeft, ChevronRight, Loader2, X, Calendar, Tag, MapPin, Clock, Users, Trophy, Wallet, Info, Share2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Markdown from 'react-markdown';
import { ShareButtons } from '../components/ShareButtons';

export const Insights: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tất Cả');

  useEffect(() => {
    const q = query(collection(db, 'articles'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })).sort((a: any, b: any) => {
        // Client-side sorting as fallback
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setArticles(articlesData);
      setLoading(false);
    }, (error) => {
      console.error("Insights fetch error:", error);
      handleFirestoreError(error, OperationType.LIST, 'articles');
    });

    return () => unsubscribe();
  }, []);

  const filteredArticles = activeCategory === 'Tất Cả' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  if (loading) return <div className="pt-40 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" /></div>;

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[716px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover brightness-[0.3]" 
            src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop" 
            referrerPolicy="no-referrer"
            alt="Insights Hero"
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
            <h1 className="text-6xl md:text-8xl serif font-bold text-on-surface leading-tight mb-6">Làm Chủ Bàn Đấu</h1>
            <p className="text-xl text-on-surface-variant font-light leading-relaxed mb-8 max-w-lg">
              Kỹ thuật, hiểu biết và ngôn ngữ tĩnh lặng của trò chơi. Khám phá di sản và sự chính xác của bida cấp độ bậc thầy.
            </p>
            <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-sans font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all">Bắt Đầu Học</button>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-outline-variant/20 pb-8 mb-16 gap-8">
          <div>
            <h2 className="text-3xl serif text-on-surface mb-2">Kỹ Thuật & Hiểu Biết</h2>
            <p className="text-sm text-on-surface-variant font-sans tracking-wide uppercase">Các bài viết chọn lọc cho người chơi nghiêm túc</p>
          </div>
          <div className="flex flex-wrap gap-6 font-sans text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
            {['Tất Cả', 'Kỹ Thuật', 'Cơ Thủ', 'Mẹo Chuyên Nghiệp', 'Trận Đấu', 'Giải Đấu'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`${activeCategory === cat ? 'text-secondary border-b-2 border-secondary' : 'hover:text-on-surface'} pb-1 px-1 transition-colors`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Featured Large Post */}
            <article 
              onClick={() => setSelectedArticle(filteredArticles[0])}
              className="md:col-span-8 group relative overflow-hidden rounded-lg bg-surface-container-low flex flex-col md:flex-row shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="md:w-1/2 overflow-hidden h-80 md:h-auto">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={filteredArticles[0].image}
                  alt={filteredArticles[0].title}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.2em] mb-4">{filteredArticles[0].category}</span>
                <h3 className="text-3xl serif mb-4 leading-snug group-hover:text-primary transition-colors">{filteredArticles[0].title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8 line-clamp-3">{filteredArticles[0].excerpt}</p>
                <div className="text-secondary serif italic text-lg inline-flex items-center gap-2 group/link">
                  Đọc Thêm <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </div>
              </div>
            </article>

            {/* Grid Posts */}
            {filteredArticles.slice(1).map(article => (
              <article 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="md:col-span-4 group bg-surface-container rounded-lg p-8 flex flex-col border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="aspect-video overflow-hidden rounded-lg mb-6">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.2em] mb-3">{article.category}</span>
                <h3 className="text-xl serif mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                <div className="mt-auto text-on-surface font-sans text-[10px] uppercase tracking-widest border-b border-outline-variant w-max pb-1">Chi Tiết</div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-on-surface-variant">
            <p>Chưa có bài viết nào trong mục này.</p>
          </div>
        )}

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

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-background/50 hover:bg-background rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="overflow-y-auto custom-scrollbar">
                <div className="h-64 md:h-96 relative">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-secondary font-bold bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                        <Tag className="w-3 h-3" /> {selectedArticle.category}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/10">
                        <Calendar className="w-3 h-3" /> {selectedArticle.date}
                      </div>
                    </div>
                    <ShareButtons 
                      title={selectedArticle.title} 
                      text={selectedArticle.excerpt} 
                      url={`${window.location.origin}/insights?id=${selectedArticle.id}`} 
                    />
                  </div>

                  <h2 className="text-4xl md:text-5xl serif font-bold text-on-surface mb-8 leading-tight">{selectedArticle.title}</h2>
                  
                  {/* Tournament Info Grid */}
                  {selectedArticle.category === 'Giải Đấu' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 bg-surface-container-high/50 rounded-xl p-8 border border-outline-variant/10">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Địa Điểm</span>
                          <span className="text-sm text-on-surface">{selectedArticle.location}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Thời Gian</span>
                          <span className="text-sm text-on-surface">{selectedArticle.time}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wallet className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Lệ Phí</span>
                          <span className="text-sm text-on-surface">{selectedArticle.fee}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Số Lượng</span>
                          <span className="text-sm text-on-surface">{selectedArticle.participants}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <Trophy className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Giải Thưởng</span>
                          <span className="text-sm text-on-surface">{selectedArticle.prizes}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <Info className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Thể Lệ</span>
                          <span className="text-sm text-on-surface">{selectedArticle.rules}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="markdown-body prose prose-invert max-w-none text-on-surface-variant leading-relaxed text-lg">
                    <Markdown>{selectedArticle.content}</Markdown>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
