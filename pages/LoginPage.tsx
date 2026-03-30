
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, password, fullName);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (_provider: 'google' | 'facebook') => {
    setError('🚀 Tính năng đăng nhập mạng xã hội đang được phát triển. Vui lòng đăng nhập bằng tài khoản thông thường.');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-100 p-6 py-12">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row border border-blue-50">
        
        {/* Left Branding Side */}
        <div className="md:w-[45%] bg-gradient-to-br from-blue-800 to-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* New Logo in Login */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                <span className="text-blue-700 font-black italic text-xl">OB</span>
              </div>
              <span className="text-3xl font-black tracking-tighter italic">OnlyBuyer.</span>
            </div>
            
            <div className="h-1.5 w-12 bg-white/30 rounded-full mb-10"></div>
            <h3 className="text-3xl font-black mb-6 leading-tight">Trải nghiệm mua sắm<br/>Hoàn toàn mới.</h3>
            <p className="text-blue-100 text-sm leading-relaxed opacity-80 max-w-xs font-medium">Cùng hàng triệu khách hàng tận hưởng những tiện ích mua sắm thông minh và an toàn hàng đầu khu vực.</p>
          </div>
          
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-4 text-[11px] font-black bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 uppercase tracking-widest">
               <span className="text-xl">⚡</span> Tiết kiệm tới 50% với OB Member
             </div>
             <div className="flex items-center gap-4 text-[11px] font-black bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 uppercase tracking-widest">
               <span className="text-xl">🛡️</span> Bảo hành chính hãng toàn quốc
             </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-[100px]"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-300 rounded-full opacity-10 blur-[80px]"></div>
        </div>

        {/* Auth Form Side */}
        <div className="md:w-[55%] p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </h3>
            <p className="text-gray-400 font-bold italic text-sm">
              {isRegister ? 'Tham gia ngay để nhận hàng ngàn ưu đãi hấp dẫn' : 'Mừng bạn quay trở lại với OnlyBuyer'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 text-xs font-black border border-red-100 flex items-center gap-3">
              <span className="text-lg">⚠️</span> {error.toUpperCase()}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ tên của bạn</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-7 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold"
                  placeholder="Họ và tên..."
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-7 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold"
                placeholder="Nhập tên tài khoản"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mật khẩu</label>
                 {!isRegister && <span className="text-[10px] text-blue-600 font-black hover:underline cursor-pointer uppercase tracking-widest">Quên mật khẩu?</span>}
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-7 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-bold"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ĐANG XỬ LÝ...
                </div>
              ) : (isRegister ? 'TẠO TÀI KHOẢN MIỄN PHÍ' : 'ĐĂNG NHẬP HỆ THỐNG')}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-8 text-gray-300">Hoặc tiếp tục với</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-black text-[10px] text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all uppercase tracking-widest"
            >
              <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="FB" />
              Facebook
            </button>
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-black text-[10px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-widest"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="GG" />
              Google
            </button>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-gray-400 font-bold text-sm"
            >
              {isRegister ? 'Bạn đã là thành viên?' : 'Chưa có tài khoản OnlyBuyer?'}
              <span className="ml-2 text-blue-600 font-black hover:underline underline-offset-8">
                {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
