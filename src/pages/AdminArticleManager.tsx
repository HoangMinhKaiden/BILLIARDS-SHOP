import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, X, Check, MapPin, Clock, Wallet, Users, Trophy, Info, Loader2, Calendar } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';
import { Navigate } from 'react-router-dom';
import { Article } from '../types';

interface ArticleFormInputs {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  // Tournament specific
  location?: string;
  time?: string;
  rules?: string;
  fee?: string;
  participants?: string;
  prizes?: string;
}

export const AdminArticleManager: React.FC = () => {
  const { isAdmin, loading: authLoading } = useFirebase();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Kỹ Thuật', 'Cơ Thủ', 'Mẹo Chuyên Nghiệp', 'Trận Đấu', 'Giải Đấu'];

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ArticleFormInputs>();
  const selectedCategory = watch('category');

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'articles'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Article[];
      setArticles(articlesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'articles');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (authLoading) return <div className="pt-32 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  const openModal = (article: Article | null = null) => {
    if (article) {
      setEditingArticle(article);
      reset(article);
    } else {
      setEditingArticle(null);
      reset({
        title: '',
        category: categories[0],
        excerpt: '',
        content: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        time: '',
        rules: '',
        fee: '',
        participants: '',
        prizes: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const openDeleteModal = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const onSubmit = async (data: ArticleFormInputs) => {
    setIsSubmitting(true);
    try {
      // Clean up optional fields if not a tournament
      if (data.category !== 'Giải Đấu') {
        delete data.location;
        delete data.time;
        delete data.rules;
        delete data.fee;
        delete data.participants;
        delete data.prizes;
      }

      if (editingArticle) {
        await setDoc(doc(db, 'articles', editingArticle.id), data);
      } else {
        await addDoc(collection(db, 'articles'), data);
      }
      closeModal();
    } catch (error) {
      handleFirestoreError(error, editingArticle ? OperationType.UPDATE : OperationType.CREATE, 'articles');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'articles', articleToDelete.id));
      closeDeleteModal();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `articles/${articleToDelete.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-2 block">Quản Trị Viên</span>
          <h1 className="serif text-5xl text-on-surface font-bold leading-tight">Quản Lý Kiến Thức & Giải Đấu</h1>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-sans font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Thêm Bài Viết
        </button>
      </header>

      <div className="bg-surface-container rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải danh sách bài viết...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-container-high text-on-surface-variant font-sans text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Tiêu Đề</th>
                <th className="px-8 py-6">Danh Mục</th>
                <th className="px-8 py-6">Ngày Đăng</th>
                <th className="px-8 py-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-surface-container-low overflow-hidden flex-shrink-0">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="max-w-md">
                        <div className="font-bold text-on-surface truncate">{article.title}</div>
                        <div className="text-xs text-on-surface-variant truncate">{article.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full border ${
                      article.category === 'Giải Đấu' 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-secondary/10 text-secondary border-secondary/20'
                    }`}>
                      {article.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-sans text-on-surface text-sm">
                    {article.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(article)}
                        className="p-2 hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(article)}
                        className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closeModal}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-5xl bg-surface-container rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20"
          >
            <div className="flex justify-between items-center p-8 border-b border-outline-variant/10">
              <h2 className="serif text-3xl">{editingArticle ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tiêu Đề</label>
                    <input 
                      {...register('title', { required: true })}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      placeholder="Tiêu đề bài viết..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Danh Mục</label>
                      <select 
                        {...register('category', { required: true })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Ngày</label>
                      <input 
                        type="date"
                        {...register('date', { required: true })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tóm Tắt Ngắn</label>
                    <textarea 
                      {...register('excerpt', { required: true })}
                      rows={2}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors resize-none"
                      placeholder="Mô tả ngắn gọn nội dung bài viết..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Nội Dung (Markdown)</label>
                    <textarea 
                      {...register('content', { required: true })}
                      rows={12}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface font-mono text-sm focus:border-primary focus:ring-0 transition-colors resize-none"
                      placeholder="Nội dung chi tiết bài viết (hỗ trợ Markdown)..."
                    />
                  </div>
                </div>

                {/* Right Column: Media & Tournament Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">URL Hình Ảnh</label>
                    <input 
                      {...register('image', { required: true })}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      placeholder="https://..."
                    />
                    {watch('image') && (
                      <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-outline-variant/10">
                        <img src={watch('image')} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {selectedCategory === 'Giải Đấu' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 bg-primary/5 rounded-xl border border-primary/20 space-y-4"
                    >
                      <h3 className="text-xs uppercase tracking-widest font-bold text-primary flex items-center gap-2">
                        <Trophy className="w-3 h-3" /> Thông Tin Giải Đấu
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-tighter text-on-surface-variant flex items-center gap-1">
                            <MapPin className="w-2 h-2" /> Địa Điểm
                          </label>
                          <input {...register('location')} className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-tighter text-on-surface-variant flex items-center gap-1">
                            <Clock className="w-2 h-2" /> Thời Gian
                          </label>
                          <input {...register('time')} className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-tighter text-on-surface-variant flex items-center gap-1">
                            <Wallet className="w-2 h-2" /> Lệ Phí
                          </label>
                          <input {...register('fee')} className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-tighter text-on-surface-variant flex items-center gap-1">
                            <Users className="w-2 h-2" /> Số Lượng
                          </label>
                          <input {...register('participants')} className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-tighter text-on-surface-variant flex items-center gap-1">
                            <Trophy className="w-2 h-2" /> Giải Thưởng
                          </label>
                          <input {...register('prizes')} className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-tighter text-on-surface-variant flex items-center gap-1">
                            <Info className="w-2 h-2" /> Thể Lệ
                          </label>
                          <textarea {...register('rules')} rows={2} className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs resize-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 rounded-lg font-sans font-bold text-sm tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-secondary text-on-secondary px-10 py-3 rounded-lg font-sans font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingArticle ? 'Cập Nhật' : 'Đăng Bài'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-surface-container rounded-2xl shadow-2xl p-8 border border-outline-variant/20"
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-error" />
              </div>
              <div>
                <h3 className="serif text-2xl mb-2">Xác Nhận Xóa</h3>
                <p className="text-on-surface-variant text-sm">
                  Bạn có chắc chắn muốn xóa bài viết <span className="text-on-surface font-bold">"{articleToDelete?.title}"</span>? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 px-6 py-3 rounded-lg font-sans font-bold text-xs tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 bg-error text-on-error px-6 py-3 rounded-lg font-sans font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Xác Nhận Xóa
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};
