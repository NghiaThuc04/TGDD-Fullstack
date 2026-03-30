
import React, { useState } from 'react';
import { useUIConfig } from '../context/UIConfigContext';

const WebInfoEditor: React.FC = () => {
  const { config, updateConfig, saveConfig, isSaving } = useUIConfig();
  const [previewSection, setPreviewSection] = useState<'hero' | 'categories' | 'promo'>('hero');

  const handleAddCategory = () => {
    const newCategory = { id: Date.now().toString(), name: 'Danh mục mới', icon: '📦' };
    updateConfig({ categories: [...config.categories, newCategory] });
  };

  const handleUpdateCategory = (id: string, field: 'name' | 'icon', value: string) => {
    const updated = config.categories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat);
    updateConfig({ categories: updated });
  };

  const handleRemoveCategory = (id: string) => {
    updateConfig({ categories: config.categories.filter(cat => cat.id !== id) });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Site Config.</h2>
          <p className="text-gray-400 font-bold text-sm italic mt-1">Thay đổi giao diện • Xem preview trực tiếp bên phải</p>
        </div>
        <button onClick={saveConfig} disabled={isSaving}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-3"
        >
          {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isSaving ? 'Đang lưu...' : 'LƯU VÀ XUẤT BẢN ⚡'}
        </button>
      </div>

      {/* ── Split Layout: Editor Left | Preview Right ── */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">

        {/* ─────────────── LEFT: Config Panel ─────────────── */}
        <div className="flex-1 space-y-8 min-w-0">

          {/* 1. Thương hiệu */}
          <section className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-50 pb-3 italic">
              1. Thông tin thương hiệu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên Website / Logo</label>
                <input type="text" value={config.logoText}
                  onChange={e => updateConfig({ logoText: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-black text-lg tracking-tight transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Màu chủ đạo</label>
                <div className="flex gap-3">
                  <input type="color" value={config.primaryColor}
                    onChange={e => updateConfig({ primaryColor: e.target.value })}
                    className="w-16 h-14 bg-gray-50 rounded-2xl cursor-pointer border-2 border-gray-100 p-1 shrink-0"
                  />
                  <input type="text" value={config.primaryColor}
                    onChange={e => updateConfig({ primaryColor: e.target.value })}
                    className="flex-grow px-5 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold uppercase tracking-widest transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slogan (hero text)</label>
              <textarea value={config.slogan || ''}
                onChange={e => updateConfig({ slogan: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-black h-20 resize-none transition-all leading-relaxed"
              />
              <p className="text-[9px] text-gray-400 font-bold italic">Dùng ký tự xuống dòng (\n) để chia dòng — sẽ hiện trên banner chính</p>
            </div>
          </section>

          {/* 2. Banners */}
          <section className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">2. Banners hero slider</h3>
              <button
                onClick={() => updateConfig({ banners: [...(config.banners || []), { id: Date.now().toString(), title: 'Tiêu đề mới', subtitle: 'PHỤ ĐỀ', image: '', ctaText: 'Mua ngay', ctaLink: '#', isActive: true }] })}
                className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary/20 transition-all"
              >+ Thêm banner</button>
            </div>
            <div className="space-y-5">
              {(config.banners || []).map((banner, idx) => (
                <div key={banner.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Banner {idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateConfig({ banners: config.banners?.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b) })}
                        className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest transition-all ${banner.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}
                      >{banner.isActive ? '● Hiện' : '○ Ẩn'}</button>
                      <button
                        onClick={() => updateConfig({ banners: config.banners?.filter(b => b.id !== banner.id) })}
                        className="w-7 h-7 bg-red-50 text-red-400 rounded-lg flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
                      >✕</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Tiêu đề lớn</label>
                      <input type="text" value={banner.title}
                        onChange={e => updateConfig({ banners: config.banners?.map(b => b.id === banner.id ? { ...b, title: e.target.value } : b) })}
                        className="w-full px-4 py-2.5 bg-white rounded-xl outline-none border border-gray-200 focus:border-primary font-black text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Phụ đề / Tag</label>
                      <input type="text" value={banner.subtitle || ''}
                        onChange={e => updateConfig({ banners: config.banners?.map(b => b.id === banner.id ? { ...b, subtitle: e.target.value } : b) })}
                        className="w-full px-4 py-2.5 bg-white rounded-xl outline-none border border-gray-200 focus:border-primary font-bold text-xs transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase">URL Hình nền</label>
                      <input type="url" value={banner.image}
                        onChange={e => updateConfig({ banners: config.banners?.map(b => b.id === banner.id ? { ...b, image: e.target.value } : b) })}
                        className="w-full px-4 py-2.5 bg-white rounded-xl outline-none border border-gray-200 focus:border-primary text-[10px] font-bold transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Text nút CTA</label>
                      <input type="text" value={banner.ctaText || ''}
                        onChange={e => updateConfig({ banners: config.banners?.map(b => b.id === banner.id ? { ...b, ctaText: e.target.value } : b) })}
                        className="w-full px-4 py-2.5 bg-white rounded-xl outline-none border border-gray-200 focus:border-primary font-bold text-xs transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Categories */}
          <section className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">3. Danh mục sản phẩm</h3>
              <button onClick={handleAddCategory}
                className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary/20 transition-all"
              >+ Thêm danh mục</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.categories.map(cat => (
                <div key={cat.id} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-3 relative group">
                  <button onClick={() => handleRemoveCategory(cat.id)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-red-100 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm z-10"
                  >✕</button>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                       {cat.icon.startsWith('http') ? <img src={cat.icon} className="w-10 h-10 object-contain drop-shadow-sm" /> : <span className="text-2xl">{cat.icon}</span>}
                    </div>
                    <div className="flex-grow space-y-2">
                       <input type="text" value={cat.name}
                         onChange={e => handleUpdateCategory(cat.id, 'name', e.target.value)}
                         className="w-full px-4 py-2.5 bg-white rounded-xl outline-none focus:border-primary border border-transparent font-black text-sm transition-all"
                         placeholder="Tên danh mục"
                       />
                       <input type="text" value={cat.icon}
                         onChange={e => handleUpdateCategory(cat.id, 'icon', e.target.value)}
                         className="w-full px-4 py-2.5 bg-white rounded-xl outline-none focus:border-primary border border-transparent font-bold text-[10px] text-gray-500 transition-all"
                         placeholder="URL ảnh hoặc Emoji (vd: 📦)"
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Promo Cards */}
          <section className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-gray-50 pb-3 italic">4. Thẻ khuyến mãi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 bg-blue-50/40 rounded-3xl border border-blue-100">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Thẻ trên (màu xanh)</span>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Tiêu đề</label>
                  <textarea value={config.promoCard1Title}
                    onChange={e => updateConfig({ promoCard1Title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none font-black text-sm resize-none h-16"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Phụ đề</label>
                  <input type="text" value={config.promoCard1Subtitle}
                    onChange={e => updateConfig({ promoCard1Subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl outline-none font-bold text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">URL hình ảnh</label>
                  <input type="url" value={config.promoCard1Image}
                    onChange={e => updateConfig({ promoCard1Image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl outline-none text-[10px]"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-3 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Thẻ dưới (màu trắng)</span>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Tiêu đề</label>
                  <textarea value={config.promoCard2Title}
                    onChange={e => updateConfig({ promoCard2Title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-black text-sm resize-none h-16"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Hashtag</label>
                  <input type="text" value={config.promoCard2Subtitle}
                    onChange={e => updateConfig({ promoCard2Subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ─────────────── RIGHT: Live Preview ─────────────── */}
        <div className="w-full xl:w-[480px] shrink-0 sticky top-6">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-blue-50/50 overflow-hidden">
            {/* Preview Header */}
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Preview</p>
              <div className="flex gap-1">
                {(['hero', 'categories', 'promo'] as const).map(tab => (
                  <button key={tab} onClick={() => setPreviewSection(tab)}
                    className={`text-[8px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest transition-all ${previewSection === tab ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                  >{tab === 'hero' ? 'Hero' : tab === 'categories' ? 'Danh mục' : 'Promo'}</button>
                ))}
              </div>
            </div>

            {/* Preview Content */}
            <div className="overflow-hidden">
              {/* Hero Preview */}
              {previewSection === 'hero' && (
                <div className="relative h-64 overflow-hidden">
                  {config.banners && config.banners.filter(b => b.isActive).length > 0 ? (
                    <img
                      src={(config.banners.find(b => b.isActive) || config.banners[0])?.image}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-8">
                    <div className="mb-2">
                      <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] bg-white/10 px-3 py-1 rounded-full">
                        {(config.banners?.find(b => b.isActive))?.subtitle || 'SUBTITLE'}
                      </span>
                    </div>
                    <h1 className="text-xl font-black text-white leading-tight whitespace-pre-line">
                      {(config.banners?.find(b => b.isActive))?.title || config.slogan || config.logoText}
                    </h1>
                    <button
                      className="mt-4 self-start px-5 py-2 text-white font-black text-[10px] uppercase tracking-widest rounded-full"
                      style={{ backgroundColor: config.primaryColor }}
                    >{(config.banners?.find(b => b.isActive))?.ctaText || 'Mua ngay'}</button>
                  </div>
                  {/* Fake Navbar */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/40 to-transparent">
                    <span className="font-black text-white text-sm tracking-tighter italic">{config.logoText}</span>
                    <div className="flex gap-3 text-white/70 text-[9px] font-bold uppercase tracking-widest">
                      <span>Trang chủ</span><span>Sản phẩm</span><span>Giỏ hàng</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Preview */}
              {previewSection === 'categories' && (
                <div className="p-6">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Danh mục sản phẩm</p>
                  <div className="grid grid-cols-3 gap-3">
                    {config.categories.map(cat => (
                      <div key={cat.id} className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-white shadow-sm border border-gray-100">
                          {cat.icon.startsWith('http') ? <img src={cat.icon} className="w-10 h-10 object-contain drop-shadow-sm" /> : cat.icon}
                        </div>
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight text-center leading-tight">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Preview */}
              {previewSection === 'promo' && (
                <div className="p-4 space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Thẻ khuyến mãi</p>
                  {/* Promo Card 1 */}
                  <div className="relative h-28 rounded-2xl overflow-hidden flex items-center" style={{ backgroundColor: config.primaryColor }}>
                    {config.promoCard1Image && (
                      <img src={config.promoCard1Image} className="absolute right-0 h-full w-1/2 object-contain object-right" />
                    )}
                    <div className="relative z-10 p-5">
                      <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">{config.promoCard1Subtitle}</p>
                      <p className="text-sm font-black text-white leading-tight whitespace-pre-line">{config.promoCard1Title}</p>
                    </div>
                  </div>
                  {/* Promo Card 2 */}
                  <div className="relative h-24 rounded-2xl overflow-hidden flex items-center bg-gray-900">
                    <div className="relative z-10 p-5">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{config.promoCard2Subtitle}</p>
                      <p className="text-sm font-black text-white leading-tight whitespace-pre-line">{config.promoCard2Title}</p>
                    </div>
                    <button className="absolute right-5 px-4 py-2 text-[9px] font-black uppercase text-white rounded-full" style={{ backgroundColor: config.primaryColor }}>
                      Xem ngay →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <p className="text-[8px] font-black text-gray-300 text-center uppercase tracking-widest italic">
                Preview cập nhật tức thì khi bạn chỉnh sửa — Bấm LƯU VÀ XUẤT BẢN để áp dụng
              </p>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-4 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Màu chủ đạo</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl shadow-lg" style={{ backgroundColor: config.primaryColor }} />
              <div className="flex gap-2">
                {['text', 'bg', 'border', 'shadow'].map(t => (
                  <div key={t} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-black ${t === 'text' ? 'bg-gray-100' : ''} ${t === 'border' ? 'border-4 bg-white' : ''}`}
                    style={{
                      color: t === 'text' ? config.primaryColor : undefined,
                      backgroundColor: t === 'bg' ? config.primaryColor : t === 'shadow' ? `${config.primaryColor}30` : undefined,
                      borderColor: t === 'border' ? config.primaryColor : undefined,
                    }}
                  >{t === 'text' ? 'Aa' : t === 'bg' ? '' : t === 'border' ? '' : '🌟'}</div>
                ))}
              </div>
              <span className="text-xs font-black text-gray-900 italic">{config.logoText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebInfoEditor;
