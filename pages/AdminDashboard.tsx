
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import OrderManagement from './OrderManagement';
import StaffManagement from './StaffManagement';
import WebInfoEditor from './WebInfoEditor';
import PostManager from './PostManager';
import ProductInventory from './ProductInventory';
import BannerManager from './BannerManager';

type AdminTab = 'orders' | 'staff' | 'webinfo' | 'posts' | 'products' | 'banners';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'staff')) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { id: 'orders', label: '🛒 Đơn hàng', roles: ['admin', 'staff'] },
    { id: 'banners', label: '🎬 Slider Banners', roles: ['admin', 'staff'] },
    { id: 'products', label: '📦 Sản phẩm', roles: ['admin', 'staff'] },
    { id: 'staff', label: '👥 Nhân sự', roles: ['admin'] },
    { id: 'webinfo', label: '🎨 Cấu hình Site', roles: ['admin'] },
    { id: 'posts', label: '📝 Quảng cáo', roles: ['admin', 'staff'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-gray-900 text-white flex-col shrink-0 flex">
        <div className="p-8 border-b border-white/10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-400 uppercase tracking-[0.2em] mb-6 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> VỀ TRANG CHỦ
          </Link>
          <h1 className="text-2xl font-black italic tracking-tighter">OB CONSOLE.</h1>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Hệ thống quản trị</p>
        </div>
        
        <nav className="p-4 md:mt-4 flex overflow-x-auto md:flex-col gap-2 md:gap-2 custom-scrollbar">
          {menuItems.filter(item => item.roles.includes(user?.role || '')).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden md:block p-6 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-black line-clamp-1">{user?.name}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto max-h-screen p-4 md:p-10 custom-scrollbar w-full">
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'webinfo' && <WebInfoEditor />}
        {activeTab === 'posts' && <PostManager />}
        {activeTab === 'products' && <ProductInventory />}
        {activeTab === 'banners' && <BannerManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
