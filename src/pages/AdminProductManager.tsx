import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, X, Check, Package, DollarSign, Tag, FileText, Image as ImageIcon, Settings, Loader2 } from 'lucide-react';
import { CATEGORIES, PRODUCTS, ARTICLES } from '../constants';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';
import { Navigate } from 'react-router-dom';

interface ProductFormInputs {
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  image: string;
  specs: { label: string; value: string }[];
}

export const AdminProductManager: React.FC = () => {
  const { isAdmin, loading: authLoading } = useFirebase();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormInputs>({
    defaultValues: {
      specs: [{ label: '', value: '' }]
    }
  });

  const specs = watch('specs');

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (authLoading) return <div className="pt-32 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      reset(product);
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        price: 0,
        category: CATEGORIES[0],
        brand: '',
        description: '',
        image: '',
        specs: [{ label: '', value: '' }]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const onSubmit = async (data: ProductFormInputs) => {
    setIsSubmitting(true);
    console.log("Submitting product data:", data);
    try {
      if (editingProduct) {
        await setDoc(doc(db, 'products', editingProduct.id), data);
      } else {
        await addDoc(collection(db, 'products'), data);
      }
      closeModal();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  const addSpecField = () => {
    setValue('specs', [...specs, { label: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    setValue('specs', specs.filter((_, i) => i !== index));
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-2 block">Quản Trị Viên</span>
          <h1 className="serif text-5xl text-on-surface font-bold leading-tight">Quản Lý Sản Phẩm</h1>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-sans font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </button>
      </header>

      <div className="bg-surface-container rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-on-surface-variant text-sm uppercase tracking-widest">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-container-high text-on-surface-variant font-sans text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Sản Phẩm</th>
                <th className="px-8 py-6">Danh Mục</th>
                <th className="px-8 py-6">Giá</th>
                <th className="px-8 py-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-surface-container-low overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{product.name}</div>
                        <div className="text-xs text-on-surface-variant uppercase tracking-tighter">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] uppercase tracking-widest font-bold rounded-full border border-secondary/20">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-sans text-on-surface">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
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
            className="relative w-full max-w-4xl bg-surface-container rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20"
          >
            <div className="flex justify-between items-center p-8 border-b border-outline-variant/10">
              <h2 className="serif text-3xl">{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <Package className="w-3 h-3" /> Tên Sản Phẩm
                    </label>
                    <input 
                      {...register('name', { required: true })}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      placeholder="VD: The Midnight Raven"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                        <DollarSign className="w-3 h-3" /> Giá ($)
                      </label>
                      <input 
                        type="number"
                        {...register('price', { required: true, min: 0, valueAsNumber: true })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                        <Tag className="w-3 h-3" /> Danh Mục
                      </label>
                      <select 
                        {...register('category', { required: true })}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <Settings className="w-3 h-3" /> Thương Hiệu
                    </label>
                    <input 
                      {...register('brand', { required: true })}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      placeholder="VD: Predator"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <ImageIcon className="w-3 h-3" /> URL Hình Ảnh
                    </label>
                    <input 
                      {...register('image', { required: true })}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Description & Specs */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <FileText className="w-3 h-3" /> Mô Tả
                    </label>
                    <textarea 
                      {...register('description', { required: true })}
                      rows={4}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-0 transition-colors resize-none"
                      placeholder="Mô tả chi tiết sản phẩm..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Thông Số Kỹ Thuật</label>
                      <button 
                        type="button"
                        onClick={addSpecField}
                        className="text-primary text-[10px] uppercase tracking-widest font-bold hover:underline"
                      >
                        + Thêm Thông Số
                      </button>
                    </div>
                    <div className="space-y-3">
                      {specs.map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <input 
                            {...register(`specs.${index}.label` as const)}
                            placeholder="Nhãn (VD: Ngọn)"
                            className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:ring-0"
                          />
                          <input 
                            {...register(`specs.${index}.value` as const)}
                            placeholder="Giá trị (VD: Carbon)"
                            className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2 text-xs text-on-surface focus:border-primary focus:ring-0"
                          />
                          <button 
                            type="button"
                            onClick={() => removeSpecField(index)}
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  {editingProduct ? 'Cập Nhật' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
};
