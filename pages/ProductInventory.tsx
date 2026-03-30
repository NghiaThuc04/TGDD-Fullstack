
import React, { useState, useEffect, useMemo } from 'react';
import { getProductsApi, saveProductApi } from '../services/api';
import { Product } from '../types';
import { useUIConfig } from '../context/UIConfigContext';
import { useAuth } from '../context/AuthContext';

const deleteProductFetch = async (id: string): Promise<void> => {
  const token = localStorage.getItem('ob_jwt_token');
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Xóa thất bại');
};

const ProductInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { config } = useUIConfig();
  const { user } = useAuth();

  useEffect(() => { loadProducts(); }, []);
  const loadProducts = () => getProductsApi().then(setProducts);

  const categorizedProducts = useMemo((): Record<string, Product[]> => {
    const groups: Record<string, Product[]> = {};
    config.categories.forEach(cat => { groups[cat.name] = []; });
    products.forEach(p => {
      const cat = p.category || 'Khác';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [products, config.categories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      await saveProductApi({
        ...editingProduct,
        id: editingProduct.id || `p${Date.now()}`,
        sold: editingProduct.sold || 0,
        rating: editingProduct.rating || 5,
        images: editingProduct.images || [],
        image: editingProduct.image || (editingProduct.images && editingProduct.images[0]) || '',
        category: editingProduct.category || config.categories[0]?.name || 'Khác',
      } as Product);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      alert('Lỗi lưu sản phẩm!');
    } finally {
      setSaving(false);
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setEditingProduct(prev => ({
      ...prev,
      images: [...(prev?.images || []), url],
      image: prev?.image || url,
    }));
    setImageUrlInput('');
  };

  const removeImage = (index: number) => {
    setEditingProduct(prev => {
      const newImages = (prev?.images || []).filter((_, i) => i !== index);
      return { ...prev, images: newImages, image: newImages[0] || '' };
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProductFetch(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Lỗi xóa sản phẩm!');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const openNew = () => {
    setEditingProduct({ images: [], name: '', description: '', price: 0, category: config.categories[0]?.name || '' });
    setImageUrlInput('');
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Inventory.</h2>
          <p className="text-gray-400 font-bold text-sm italic mt-1">Quản lý kho hàng theo danh mục • {products.length} sản phẩm</p>
        </div>
        <button onClick={openNew}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:-translate-y-1 transition-all"
        >+ THÊM SẢN PHẨM</button>
      </div>

      {/* Categorized List */}
      <div className="space-y-14">
        {(Object.entries(categorizedProducts) as [string, Product[]][]).map(([categoryName, items]) => (
          <div key={categoryName} className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-primary/20 bg-primary shrink-0 relative overflow-hidden">
                  {(() => {
                    const matchedCat = config.categories.find(c => c.name === categoryName);
                    if (matchedCat?.icon?.startsWith('http')) {
                      return <img src={matchedCat.icon} className="w-6 h-6 object-contain drop-shadow-md z-10" alt={categoryName} />;
                    }
                    return <span className="z-10">{matchedCat?.icon || '📦'}</span>;
                  })()}
                  <div className="absolute inset-0 bg-white/10 z-0"></div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">{categoryName}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{items.length} sản phẩm</p>
                </div>
              </div>
              <button
                onClick={() => { setEditingProduct({ images: [], category: categoryName }); setImageUrlInput(''); }}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >+ Thêm vào {categoryName}</button>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest italic">Danh mục này đang trống</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map(p => (
                  <div key={p.id}
                    className="bg-white p-5 rounded-3xl border border-gray-100 flex flex-col gap-3 group hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all"
                  >
                    <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50">
                      <img src={p.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => (e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image')}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                        <button onClick={() => { setEditingProduct(p); setImageUrlInput(''); }}
                          className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-md hover:bg-primary hover:text-white transition-all text-sm"
                        >✎</button>
                        {confirmDelete === p.id ? (
                          <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
                            className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md text-xs font-black disabled:opacity-50"
                          >{deletingId === p.id ? '...' : '✓'}</button>
                        ) : (
                          <button onClick={() => setConfirmDelete(p.id)}
                            className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-red-400 shadow-md hover:bg-red-500 hover:text-white transition-all text-sm"
                          >✕</button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-900 leading-tight line-clamp-1">{p.name}</h4>
                      <p className="text-[12px] font-black text-primary italic mt-0.5">{p.price.toLocaleString()}đ</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-black text-gray-300 uppercase">⭐ {p.rating}</span>
                        <span className="text-[9px] font-black text-gray-300 uppercase">Đã bán: {p.sold}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Edit/Create Modal ─── */}
      {editingProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
          <form onSubmit={handleSave}
            className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[40px] p-8 md:p-12 shadow-2xl space-y-8 animate-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                  {editingProduct.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                {editingProduct.id && (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">ID: {editingProduct.id}</p>
                )}
              </div>
              <button type="button" onClick={() => setEditingProduct(null)}
                className="w-12 h-12 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:rotate-90 transition-all font-black text-xl"
              >×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: thông tin sản phẩm */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên sản phẩm *</label>
                  <input required placeholder="Vd: iPhone 16 Pro Max..."
                    className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm"
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá bán (VNĐ) *</label>
                  <input required type="number" min="0" placeholder="Nhập giá tiền..."
                    className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm"
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục *</label>
                  <div className="relative">
                    <select required
                      className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold text-sm appearance-none cursor-pointer transition-all"
                      value={editingProduct.category || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {config.categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                      <option value="Khác">📦 Khác</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đánh giá (1-5)</label>
                    <input type="number" min="1" max="5" step="0.1"
                      className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm"
                      value={editingProduct.rating || 5}
                      onChange={e => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đã bán</label>
                    <input type="number" min="0"
                      className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm"
                      value={editingProduct.sold || 0}
                      onChange={e => setEditingProduct({ ...editingProduct, sold: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả sản phẩm *</label>
                  <textarea required placeholder="Nhập đặc điểm nổi bật, thông số kỹ thuật..."
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold h-32 resize-none transition-all text-sm leading-relaxed"
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Right: hình ảnh qua URL */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hình ảnh sản phẩm (URL)</label>

                {/* URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="flex-grow px-4 py-3 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold text-xs transition-all"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                  />
                  <button type="button" onClick={handleAddImageUrl}
                    className="bg-primary text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all whitespace-nowrap"
                  >+ Thêm</button>
                </div>
                <p className="text-[9px] text-gray-400 font-bold italic">Nhấn Enter hoặc bấm "+ Thêm" để thêm ảnh. Ảnh đầu tiên là ảnh chính.</p>

                {/* Preview Grid */}
                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl min-h-[180px] border-2 border-dashed border-gray-200">
                  {(editingProduct.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square animate-in zoom-in duration-300">
                      <img src={img} alt={`img-${idx}`}
                        className="w-full h-full object-cover rounded-xl shadow-sm border border-white"
                        onError={e => { e.currentTarget.src = 'https://via.placeholder.com/100?text=Error'; }}
                      />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-md hover:scale-110 transition-transform"
                      >✕</button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-primary text-white text-[7px] px-1.5 py-0.5 rounded-md font-black italic shadow-sm uppercase">Chính</span>
                      )}
                    </div>
                  ))}
                  {(!editingProduct.images || editingProduct.images.length === 0) && (
                    <div className="col-span-3 flex flex-col items-center justify-center text-gray-300 py-6">
                      <span className="text-4xl mb-2">🖼️</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed">Dán URL hình ảnh<br />vào ô bên trên rồi bấm + Thêm</p>
                    </div>
                  )}
                </div>

                {/* Ảnh preview lớn */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-video border border-gray-200">
                    <img src={editingProduct.images[0]} alt="Preview"
                      className="w-full h-full object-contain"
                      onError={e => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Preview'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t border-gray-50 pt-6">
              <button type="button" onClick={() => setEditingProduct(null)}
                className="px-8 py-3.5 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
              >Đóng</button>
              <button type="submit" disabled={saving}
                className="bg-primary text-white px-12 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-60 flex items-center gap-3"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? 'Đang lưu...' : 'Lưu sản phẩm 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductInventory;
