
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAllOrdersApi } from '../services/api';
import { Order } from '../types';

const AccountSettings: React.FC = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phoneNumber || '');
      setAddress(user.address || '');
      setAvatar(user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      setLoadingOrders(true);
      getAllOrdersApi().then(setOrders).catch(console.error).finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedPhone = phone.trim();
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(formattedPhone)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.");
        setLoading(false);
        return;
      }
      
      await updateProfile({ name: name.trim(), phoneNumber: formattedPhone, address: address.trim(), avatar });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Lỗi cập nhật hồ sơ!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { alert("Mật khẩu mới không khớp!"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        
        {/* Profile Summary Card - Optimized for Mobile */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-4 md:mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[30px] md:rounded-[40px] overflow-hidden border-4 border-gray-50 shadow-lg group-hover:opacity-90 transition-all">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                <input type="file" className="hidden" onChange={() => setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")} />
                <span className="text-sm">📷</span>
              </label>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{user?.name}</h2>
            <p className="text-primary font-black uppercase text-[9px] tracking-widest mt-1 opacity-60 italic">{user?.role} member</p>
            
            {/* Tab Navigation - Horizontal Scroll on Mobile */}
            <div className="w-full mt-6 md:mt-10 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-shrink-0 lg:w-full text-center lg:text-left px-5 md:px-6 py-3 md:py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50 border border-transparent lg:border-none'}`}
              >
                👤 Hồ sơ
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex-shrink-0 lg:w-full text-center lg:text-left px-5 md:px-6 py-3 md:py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50 border border-transparent lg:border-none'}`}
              >
                🔒 Bảo mật
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-shrink-0 lg:w-full text-center lg:text-left px-5 md:px-6 py-3 md:py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50 border border-transparent lg:border-none'}`}
              >
                📦 Đơn hàng
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Adjusted Padding for Mobile */}
        <div className="lg:flex-grow">
          <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 lg:p-16 border border-gray-100 shadow-sm min-h-[500px]">
            {success && (
              <div className="bg-green-50 text-green-700 p-4 md:p-6 rounded-[24px] mb-8 text-[10px] md:text-[11px] font-black border border-green-100 animate-toast flex items-center gap-3">
                <div className="shrink-0 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm shadow-md">✓</div>
                <p className="uppercase tracking-widest">Cập nhật thành công!</p>
              </div>
            )}

            {activeTab === 'orders' ? (
              <div className="space-y-6 md:space-y-10">
                <div className="border-b border-gray-50 pb-6 md:pb-8">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Đơn hàng của bạn.</h3>
                  <p className="text-gray-400 font-bold text-xs md:text-sm italic mt-1">Theo dõi trạng thái đơn hàng</p>
                </div>

                {loadingOrders ? (
                  <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center">
                    <span className="text-4xl mb-4">🛒</span>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] italic">Bạn chưa có đơn hàng nào</p>
                    <Link to="/" className="mt-4 text-primary font-black uppercase text-xs tracking-widest hover:underline">Hãy mua sắm ngay</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-[24px] border-2 border-gray-50 hover:border-primary/20 transition-all space-y-4 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                          <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-lg">#{order.id}</span>
                            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl ${order.status === 'completed' ? 'bg-green-100 text-green-600' : order.status === 'cancelled' ? 'bg-red-100 text-red-600' : order.status === 'shipping' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : order.status === 'shipping' ? 'bg-blue-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                              {order.status === 'completed' ? 'Hoàn thành' : order.status === 'cancelled' ? 'Đã hủy' : order.status === 'shipping' ? 'Đang giao hàng' : 'Đang xử lý'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <img src={item.image} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-sm" />
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-xs text-gray-900 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SL: {item.quantity}</p>
                              </div>
                              <div className="font-black text-gray-900 text-sm flex-shrink-0 italic">{(item.price * item.quantity).toLocaleString()}đ</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-end pt-5 border-t border-gray-50">
                          <div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Thanh toán</span>
                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest mt-1">
                              {order.paymentMethod === 'Transfer' ? 'Chuyển khoản' : 'Thu hộ COD'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tổng thành tiền</span>
                            <p className="text-2xl font-black italic text-primary">{order.total.toLocaleString()}đ</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'profile' ? (
              <form onSubmit={handleSaveProfile} className="space-y-6 md:space-y-10">
                <div className="border-b border-gray-50 pb-6 md:pb-8">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Cài đặt hồ sơ.</h3>
                  <p className="text-gray-400 font-bold text-xs md:text-sm italic mt-1">Thông tin công khai của bạn trên OnlyBuyer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-sm md:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                    <input 
                      type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-sm md:text-base"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ giao hàng</label>
                  <textarea 
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-6 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-[32px] bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold h-32 resize-none text-sm md:text-base"
                  />
                </div>

                <div className="pt-4 md:pt-6">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full lg:w-auto bg-primary text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu hồ sơ'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6 md:space-y-10">
                <div className="border-b border-gray-50 pb-6 md:pb-8">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Bảo mật.</h3>
                  <p className="text-gray-400 font-bold text-xs md:text-sm italic mt-1">Cập nhật mật khẩu định kỳ</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
                    <input 
                      type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-red-50 focus:border-red-200 transition-all outline-none font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                      <input 
                        type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Xác nhận</label>
                      <input 
                        type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 md:pt-6">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full lg:w-auto bg-gray-900 text-white px-10 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
