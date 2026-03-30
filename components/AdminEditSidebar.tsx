
import React, { useState } from 'react';
import { useUIConfig } from '../context/UIConfigContext';

const AdminEditSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { config, updateConfig, saveConfig, isSaving } = useUIConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[100] border-l border-gray-100 flex flex-col transition-transform">
      <div className="p-6 bg-blue-700 text-white flex justify-between items-center">
        <div>
          <h2 className="font-black text-xl uppercase tracking-tighter italic italic">Admin Tool</h2>
          <p className="text-[10px] font-bold opacity-80">Chỉnh sửa giao diện Live</p>
        </div>
        <button onClick={onClose} className="hover:bg-blue-600 p-2 rounded-lg transition-colors text-white font-black text-xl">×</button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Branding Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Thương hiệu</h3>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500">Tên Logo</label>
            <input 
              type="text" 
              value={config.logoText}
              onChange={(e) => updateConfig({ logoText: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500">Slogan Trang Chủ</label>
            <textarea 
              value={config.slogan}
              onChange={(e) => updateConfig({ slogan: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm h-20 resize-none"
            />
          </div>
        </div>

        {/* Theme Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Chủ đề (Theme)</h3>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500">Màu chủ đạo</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
              />
              <input 
                type="text" 
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Banner Quảng cáo</h3>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Hiển thị Banner</label>
            <input 
              type="checkbox" 
              checked={config.showBanner}
              onChange={(e) => updateConfig({ showBanner: e.target.checked })}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>
          {/* fix: Removed non-existent bannerUrl property input which caused property 'bannerUrl' does not exist error */}
        </div>

        {/* Visibility Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Hiển thị Sections</h3>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Danh mục</label>
            <input 
              type="checkbox" 
              checked={config.showCategories}
              onChange={(e) => updateConfig({ showCategories: e.target.checked })}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">Sản phẩm nổi bật</label>
            <input 
              type="checkbox" 
              checked={config.showFeaturedProducts}
              onChange={(e) => updateConfig({ showFeaturedProducts: e.target.checked })}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100">
        <button 
          onClick={saveConfig}
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? (
             <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> ĐANG LƯU...</>
          ) : 'LƯU CẤU HÌNH UI'}
        </button>
      </div>
    </div>
  );
};

export default AdminEditSidebar;
