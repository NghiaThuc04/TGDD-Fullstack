
import React, { useState } from 'react';
import { useUIConfig } from '../context/UIConfigContext';
import { Banner } from '../types';

const BannerManager: React.FC = () => {
  const { config, updateConfig } = useUIConfig();
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const bannerToSave = {
      ...editingBanner,
      id: editingBanner.id || `b${Date.now()}`,
      isActive: editingBanner.isActive ?? true
    } as Banner;

    const existingIndex = config.banners.findIndex(b => b.id === bannerToSave.id);
    let updatedBanners;
    if (existingIndex !== -1) {
      updatedBanners = [...config.banners];
      updatedBanners[existingIndex] = bannerToSave;
    } else {
      updatedBanners = [...config.banners, bannerToSave];
    }

    updateConfig({ banners: updatedBanners });
    setEditingBanner(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      updateConfig({ banners: config.banners.filter(b => b.id !== id) });
    }
  };

  const toggleStatus = (id: string) => {
    const updated = config.banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    updateConfig({ banners: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Banner Center.</h2>
          <p className="text-gray-400 font-bold text-sm italic mt-1">Quản lý hệ thống Slider quảng cáo</p>
        </div>
        <button 
          onClick={() => setEditingBanner({ title: '', subtitle: '', image: '', ctaText: 'Xem thêm', ctaLink: '#', isActive: true })}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
        >
          + THÊM BANNER MỚI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
            <div className="h-48 relative">
              <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => setEditingBanner(banner)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all"
                >
                  ✎
                </button>
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                  banner.isActive ? 'bg-green-500/80 text-white border-white' : 'bg-gray-500/80 text-white border-white'
                }`}>
                  {banner.isActive ? 'ĐANG CHẠY' : 'ĐÃ TẮT'}
                </span>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{banner.subtitle}</span>
              <h3 className="font-black text-gray-900 leading-tight line-clamp-2 h-12 mb-4">{banner.title}</h3>
              <div className="flex justify-between items-center border-t pt-4 mt-auto">
                <button 
                  onClick={() => toggleStatus(banner.id)}
                  className={`text-[10px] font-black uppercase transition-colors ${banner.isActive ? 'text-orange-500 hover:text-orange-600' : 'text-green-500 hover:text-green-600'}`}
                >
                  {banner.isActive ? 'TẠM NGỪNG' : 'KÍCH HOẠT LẠI'}
                </button>
                <span className="text-[10px] font-bold text-gray-400 italic">Click: 0</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingBanner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setEditingBanner(null)}></div>
          <form onSubmit={handleSaveBanner} className="relative bg-white w-full max-w-2xl rounded-[48px] p-10 shadow-2xl space-y-6 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter border-b pb-4">Cấu hình Banner</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhãn (Subtitle)</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary font-bold"
                  value={editingBanner.subtitle || ''}
                  onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})}
                  placeholder="Vd: MỚI RA MẮT"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề (Hỗ trợ xuống dòng)</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary font-bold"
                  value={editingBanner.title || ''}
                  onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                  placeholder="Vd: Trải nghiệm\nHoàn toàn mới"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hình ảnh (URL)</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary font-bold text-xs"
                  value={editingBanner.image || ''}
                  onChange={e => setEditingBanner({...editingBanner, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Văn bản nút (CTA)</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary font-bold"
                  value={editingBanner.ctaText || ''}
                  onChange={e => setEditingBanner({...editingBanner, ctaText: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link chuyển hướng</label>
                <input 
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary font-bold"
                  value={editingBanner.ctaLink || ''}
                  onChange={e => setEditingBanner({...editingBanner, ctaLink: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-8">
              <button type="button" onClick={() => setEditingBanner(null)} className="px-8 py-4 font-black text-xs uppercase tracking-widest text-gray-400">Hủy bỏ</button>
              <button type="submit" className="bg-primary text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1">Lưu Banner ⚡</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BannerManager;
