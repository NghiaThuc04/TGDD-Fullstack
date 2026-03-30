
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-blue-700 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black uppercase tracking-tight italic">⚙️ OnlyBuyer Console</h1>
            <p className="opacity-80 mt-2 font-bold uppercase text-[11px] tracking-widest">Administrator: {user?.name}</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:border-blue-300 transition-all group">
            <h3 className="text-xl font-black mb-6 flex items-center uppercase tracking-tighter">
              <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">📱</span> Kho sản phẩm
            </h3>
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <span className="text-sm font-bold text-gray-500 uppercase">Điện tử</span>
                  <span className="font-black text-blue-600">02</span>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <span className="text-sm font-bold text-gray-500 uppercase">Thời trang</span>
                  <span className="font-black text-blue-600">02</span>
               </div>
               <button className="w-full mt-2 bg-blue-600 text-white py-3 rounded-2xl font-black uppercase text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-50">
                + THÊM SẢN PHẨM MỚI
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:border-blue-300 transition-all group">
            <h3 className="text-xl font-black mb-6 flex items-center uppercase tracking-tighter">
              <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">📊</span> Báo cáo doanh thu
            </h3>
            <div className="text-center py-4">
               <div className="text-4xl font-black text-blue-700">54.3M</div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">DOANH THU THÁNG NÀY</p>
            </div>
            <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 w-2/3"></div>
            </div>
            <p className="text-[9px] font-bold text-blue-500 mt-2 text-center italic">Đạt 66% chỉ tiêu quý I</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 hover:border-blue-300 transition-all group">
            <h3 className="text-xl font-black mb-6 flex items-center uppercase tracking-tighter">
              <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">🛒</span> Đơn hàng mới
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border-l-4 border-l-orange-500 shadow-sm">
                <p className="font-black text-sm">#OB-98213</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Customer: John Doe • 29.9M</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-black italic">CHỜ XỬ LÝ</span>
              </div>
            </div>
            <Link to="/admin/orders" className="w-full mt-6 block text-center bg-gray-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
              Xem toàn bộ đơn hàng →
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">TRẠNG THÁI HỆ THỐNG</h4>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-black text-gray-800 uppercase italic">CÁC API ĐANG HOẠT ĐỘNG BÌNH THƯỜNG</span>
             </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border border-gray-200 px-8 py-3 rounded-2xl text-xs font-black hover:bg-gray-100 transition-all uppercase tracking-widest">Cài đặt SEO</button>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all uppercase tracking-widest">Thiết lập kho</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
