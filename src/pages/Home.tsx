import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Mail, Globe, MessageSquare, ArrowUpRight, CheckCircle2, Truck, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), limit(2));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setFeaturedProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background z-10"></div>
        <img 
          alt="Cơ bida cao cấp" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd5f_8A-4SLh-uAea6HtowYholL8otuATrWXKQ7C6PHvauM0tmRDsfT7Zm91oCYPan8s_KRMI3Invr_K8GMGl5itakhDI-weuhyD3uy9J6o6cSqqL294HXrzE674Ykyo3AFm8oqfUcX37kQKV0Cx6v5-S7aTrOP1177hEROnvtgPelQgbW1cFOx1KZPz6pTu4px6fYD1KiL6I-YxANbYHSqq1kQCabLTduQigsYpJpBYjboull7qki2GWK_73e5f8DYFG0AGkCHSbF"
          referrerPolicy="no-referrer"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="serif text-6xl md:text-8xl lg:text-9xl tracking-tight text-on-surface mb-6">
            Sự Chính Xác Trong <br/><span className="italic text-primary">Từng Cú Đánh.</span>
          </h1>
          <p className="font-sans text-sm uppercase tracking-[0.4em] text-on-surface-variant mb-12 max-w-xl mx-auto">
            Nơi kỹ thuật bậc thầy hòa quyện cùng tâm hồn của trò chơi.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link to="/feed" className="bg-primary text-on-primary px-10 py-4 rounded-md font-bold tracking-tight shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Khám Phá Bảng Tin
            </Link>
            <button className="text-secondary serif text-xl border-b-2 border-secondary/30 hover:border-secondary transition-all">
              Thiết Kế Riêng
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured Cues */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Lựa Chọn Hàng Đầu</span>
            <h2 className="serif text-4xl md:text-5xl">Cơ Nổi Bật</h2>
          </div>
          <Link to="/feed" className="text-on-surface-variant font-sans text-sm hover:text-primary transition-colors">Xem Tất Cả</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {loading ? (
            <div className="md:col-span-12 py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : (
            <>
              {/* Large Card */}
              {featuredProducts[0] && (
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="md:col-span-7 bg-surface-container-low rounded-xl overflow-hidden group"
                >
                  <Link to={`/product/${featuredProducts[0].id}`}>
                    <div className="h-96 overflow-hidden">
                      <img 
                        alt={featuredProducts[0].name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={featuredProducts[0].image}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 flex justify-between items-start">
                      <div>
                        <h3 className="serif text-3xl mb-2 text-on-surface">{featuredProducts[0].name}</h3>
                        <p className="text-on-surface-variant font-sans">{featuredProducts[0].brand}</p>
                      </div>
                      <span className="serif text-2xl text-secondary">${featuredProducts[0].price.toLocaleString()}</span>
                    </div>
                  </Link>
                </motion.div>
              )}
              {/* Tall Card */}
              {featuredProducts[1] && (
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="md:col-span-5 bg-surface-container rounded-xl overflow-hidden group flex flex-col"
                >
                  <Link to={`/product/${featuredProducts[1].id}`} className="flex flex-col h-full">
                    <div className="flex-grow overflow-hidden">
                      <img 
                        alt={featuredProducts[1].name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={featuredProducts[1].image}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="serif text-2xl mb-1 text-on-surface">{featuredProducts[1].name}</h3>
                      <p className="text-on-surface-variant font-sans text-sm mb-4">{featuredProducts[1].brand}</p>
                      <span className="serif text-xl text-secondary">${featuredProducts[1].price.toLocaleString()}</span>
                    </div>
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Explore Accessories */}
      <section className="bg-surface-container-lowest py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <h2 className="serif text-4xl md:text-5xl text-on-surface">Khám Phá Phụ Kiện</h2>
            <div className="h-1 w-20 bg-primary mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <CategoryCard 
              title="Phấn Master" 
              desc="Độ ma sát cực cao cho khả năng kiểm soát xoáy hoàn hảo." 
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuCCUxYfWm1J69RQwgrLbFjJOFkurAHOj8yqBleA9YVoHaHC8_zDpgLO68gdU8NtfjkkqDThO9144sz8XTvKMn2CQPCKYPMnFV7ceo4Raw7PqfKBfG4nAfbUQuvIjA3xrDEZ1U3g0MreSZDtvlsl_CbRq49c6h3mo2Dqm4mvqjUIgx-ffG91GtG5UHHYijnGVgICOgsgw9tsq3TSLFcfsM-IJCRp3O7suSrFH5ei9ehe5dVeQU2kOGu5KPyE3dq9qHAdAlvrsYpzveqJ"
            />
            <CategoryCard 
              title="Đầu Cơ Chính Xác" 
              desc="Đầu da nhiều lớp được thiết kế cho cảm giác tối đa." 
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuBQrM1rIf2fu74hbU9iq3eoF9iyAekediRO1tgJ1nEFrviJH8hvM-FEtbdFPQj2Y-59M8jq39w-fzfF0nMGiSOIKQNDfpnKedTl4Oid2d3VWxf3voD50P6OnTJ13e8gFWq1kYPVKulbyT-I3UbYP-vpRDd1L1HjPvzEJAXbxjoszOj4mxuumEsGO-SNrb18zoDwCTaAJ6bPM0I2znWxiiZGYVgp5-yUOKVkxn6B0jJpR1vhRL35WeRJtG0II7snoSDUSHLglQgMr6Ii"
            />
            <CategoryCard 
              title="Bao Cơ Cứng" 
              desc="Bảo vệ bằng da thủ công cho nhạc cụ của bạn." 
              img="https://lh3.googleusercontent.com/aida-public/AB6AXuC8WHB8hQfWiw3LpFt7MUBc6cniczXM6zXo8E9Dfva5NVZArs364wZH7RQbINFnQ4ys1WwfjZr-9WdB8xoY-2n2BPndgbwl_k34r_M43mfWoBe_CUB-xCME6wtQ5ruPYtxakOWezvzN1-6Yn-iAmUY_OCQla8kNf71hUAtGEcMHCegbm9lrf2F7maR7J1So4meP7r864ldYCI0rOn_TCJkv1SkB46WSrhcOXfxJiOjGtF1FAPSuCuelryFMjPx1SR3tktSK-ncaUkoy"
            />
          </div>
        </div>
      </section>

      {/* Craftsmanship Story */}
      <section className="relative bg-background py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <span className="font-sans text-xs uppercase tracking-widest text-primary mb-6 block">Di Sản Của Chúng Tôi</span>
            <h2 className="serif text-5xl md:text-7xl mb-10 leading-tight">Thủ Công Là Một <span className="italic">Ngôn Ngữ Tĩnh Lặng.</span></h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10 font-sans">
              Mỗi cây cơ tại Grandmaster's Study đều trải qua quy trình hoàn thiện nghiêm ngặt kéo dài 14 tháng. Từ việc lựa chọn gỗ Phong Hard Rock Bắc Mỹ đến lớp hoàn thiện đánh bóng bằng tay cuối cùng, chúng tôi coi mỗi cây cơ là một di sản.
            </p>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <span className="serif text-2xl text-secondary">01</span>
                <div>
                  <h5 className="font-bold mb-2">Nguồn Gốc Đạo Đức</h5>
                  <p className="text-sm text-on-surface-variant">Chỉ những loại gỗ ngoại lai cao cấp nhất, được khai thác có trách nhiệm từ các khu rừng được quản lý.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <span className="serif text-2xl text-secondary">02</span>
                <div>
                  <h5 className="font-bold mb-2">Cân Bằng Chính Xác</h5>
                  <p className="text-sm text-on-surface-variant">Trọng lượng bên trong được hiệu chỉnh chính xác đến 0.1oz theo sở thích của bạn.</p>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-primary/20"></div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                alt="Nghệ nhân đang làm việc" 
                className="w-full aspect-[4/5] object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAho7s9QU0sAocyDRlniXkt9atXCVefTpl6N556HbSy3TPm8V2tNVjG2SGND016tc3S-7dDVo663Ng0cAcBb420avPAa-JxJgT7M_6qNzGlskQe3FpFPpA9u0s0d3k0tyl30tbAm0RGyQuEUqp0W8KAbFfnXmCYN62tUGGnHuCMA64eZyFEWvjkXAps4lP6PJApp8F-9q0xfovkAHbC_du8HsVzltQrvkTvqD0nRZGihv8IZ_Ls7JnHTUfOL8mF8FbVRWvyXRns2tGp"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-surface-container p-8 rounded-lg shadow-xl max-w-[240px]">
              <p className="serif italic text-lg leading-snug">"Cây cơ phải là phần mở rộng của cánh tay, không phải là một gánh nặng trên bàn tay."</p>
              <p className="font-sans text-xs uppercase tracking-widest mt-4 text-on-surface-variant">— Bậc Thầy Chế Tác</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CategoryCard: React.FC<{ title: string; desc: string; img: string }> = ({ title, desc, img }) => (
  <div className="relative group cursor-pointer h-96 overflow-hidden rounded-lg">
    <img 
      alt={title} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
      src={img}
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors flex flex-col justify-end p-8">
      <h4 className="serif text-3xl mb-2">{title}</h4>
      <p className="text-on-surface-variant text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity">{desc}</p>
      <span className="text-primary font-sans text-xs uppercase tracking-widest flex items-center gap-2">
        Explore <ArrowRight className="w-4 h-4" />
      </span>
    </div>
  </div>
);
