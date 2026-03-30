
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrderApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<{code: number, name: string} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{code: number, name: string} | null>(null);
  const [selectedWard, setSelectedWard] = useState<{code: number, name: string} | null>(null);
  const [street, setStreet] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Transfer'>('COD');
  const [transferProvider, setTransferProvider] = useState<'Momo' | 'VNPay'>('Momo');
  
  const [loading, setLoading] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  
  const timerRef = useRef<any>(null);

  const MOMO_LOGO = "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png";
  const VNPAY_LOGO = "https://vnpay.vn/wp-content/uploads/2020/07/icon-vnpay.png";

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phoneNumber || '');
      setStreet(user.address || ''); // Assuming old freeform address maps to street initially
    }
  }, [user]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(console.error);
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    if (!code) {
      setSelectedProvince(null); setDistricts([]); setWards([]); setSelectedDistrict(null); setSelectedWard(null);
      return;
    }
    setSelectedProvince({ code: parseInt(code), name });
    setSelectedDistrict(null); setSelectedWard(null); setWards([]);
    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts || []))
      .catch(console.error);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    if (!code) { setSelectedDistrict(null); setWards([]); setSelectedWard(null); return; }
    setSelectedDistrict({ code: parseInt(code), name }); setSelectedWard(null);
    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then(res => res.json())
      .then(data => setWards(data.wards || []))
      .catch(console.error);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    if (!code) { setSelectedWard(null); return; }
    setSelectedWard({ code: parseInt(code), name });
  };

  // Handle countdown timer when transfer is selected and order is placed
  useEffect(() => {
    if (successOrderId && paymentMethod === 'Transfer') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [successOrderId, paymentMethod]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.");
      return;
    }

    setLoading(true);
    try {
      const fullAddress = [street.trim(), selectedWard?.name, selectedDistrict?.name, selectedProvince?.name].filter(Boolean).join(', ');
      const res = await placeOrderApi({ 
        userId: user?.id, 
        items: cart, 
        total: totalPrice,
        address: fullAddress,
        customerName: customerName,
        customerPhone: customerPhone,
        paymentMethod: paymentMethod,
        transferProvider: paymentMethod === 'Transfer' ? transferProvider : undefined
      });
      setSuccessOrderId(res.orderId);
      clearCart();
    } catch (err) {
      alert("Lỗi đặt hàng!");
    } finally {
      setLoading(false);
    }
  };

  if (successOrderId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
        {paymentMethod === 'Transfer' && timeLeft > 0 ? (
          <div className="bg-white p-6 md:p-16 rounded-[48px] shadow-2xl border border-blue-50 animate-in fade-in zoom-in duration-500">
            <div className="mb-10 inline-flex items-center gap-3 bg-orange-50 text-orange-600 px-8 py-3 rounded-2xl border border-orange-100">
               <span className="animate-pulse text-xl">⏳</span>
               <span className="font-black text-xs md:text-sm tracking-widest uppercase">
                 Hết hạn sau: <span className="text-lg ml-1">{formatTime(timeLeft)}</span>
               </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Quét mã thanh toán</h2>
            <p className="text-gray-400 font-bold mb-12 italic text-sm md:text-base">Vui lòng hoàn tất trong 5 phút để đơn hàng được xác nhận tự động.</p>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-12">
              <div className="bg-gray-50 p-8 rounded-[40px] border-4 border-dashed border-gray-200 relative group">
                <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                  <img src={transferProvider === 'Momo' ? MOMO_LOGO : VNPAY_LOGO} className="w-8 h-8 object-contain" alt="Provider" />
                </div>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=OB_PAYMENT_${successOrderId}_${transferProvider}`} 
                  className="w-56 h-56 md:w-72 md:h-72 object-contain mix-blend-multiply" 
                  alt="Payment QR" 
                />
                <div className="mt-6 font-black text-primary uppercase tracking-widest text-xs">Mã QR {transferProvider} Chính Chủ</div>
              </div>

              <div className="text-left space-y-6 w-full max-w-sm">
                <div className="bg-blue-600 p-6 rounded-[32px] shadow-xl shadow-blue-100 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Tổng số tiền</p>
                  <p className="text-4xl font-black italic">{totalPrice.toLocaleString()}đ</p>
                </div>
                
                <div className="bg-white p-6 rounded-[32px] border-2 border-orange-500 shadow-xl shadow-orange-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <span className="text-6xl font-black">#</span>
                  </div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Nội dung chuyển khoản</p>
                  <p className="text-3xl font-black text-gray-900 tracking-wider font-mono">{successOrderId}</p>
                  <p className="text-[10px] text-orange-600 font-bold italic mt-3 leading-relaxed">
                    * QUAN TRỌNG: Nhập mã này vào phần nội dung chuyển tiền để Admin xác nhận ngay.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')} 
              className="w-full md:w-auto bg-gray-900 text-white px-20 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-primary shadow-2xl transition-all active:scale-95"
            >
              Tôi đã chuyển khoản thành công
            </button>
          </div>
        ) : (
          <div className="bg-white p-12 md:p-20 rounded-[48px] shadow-2xl border border-gray-100 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[32px] flex items-center justify-center text-5xl mx-auto mb-10 shadow-xl shadow-green-50">✓</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase italic">Đặt hàng thành công!</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto my-8 rounded-full"></div>
            <p className="text-gray-500 font-medium text-lg">Mã vận đơn của bạn: <span className="font-black text-primary underline underline-offset-8">{successOrderId}</span></p>
            
            {timeLeft === 0 && paymentMethod === 'Transfer' && (
              <div className="mt-10 p-6 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-red-500 font-black uppercase text-xs tracking-widest">
                  ⚠️ Mã QR đã hết hạn. Nếu bạn đã chuyển khoản, vui lòng nhắn tin cho hỗ trợ kèm mã đơn hàng.
                </p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-16">
              <button onClick={() => navigate('/')} className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 shadow-2xl shadow-primary/30 transition-all">
                Tiếp tục mua sắm
              </button>
              <button onClick={() => navigate('/account')} className="bg-white border-2 border-gray-100 text-gray-900 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">
                Xem đơn hàng của tôi
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row items-baseline gap-4 mb-12">
        <h1 className="text-3xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic">Thanh toán.</h1>
        <p className="text-gray-400 font-bold italic text-sm md:text-xl">Hoàn tất trải nghiệm mua sắm của bạn</p>
      </div>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        <div className="space-y-12">
          {/* Section 1: Shipping Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-4">
              <span className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-sm italic">01</span>
              Thông tin nhận hàng
            </h2>
            <div className="grid grid-cols-1 gap-6 bg-white p-6 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên người nhận</label>
                <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-7 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary font-bold transition-all text-sm md:text-base" placeholder="Họ và tên..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại liên hệ</label>
                <input required type="tel" maxLength={10} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full px-7 py-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary font-bold transition-all text-sm md:text-base" placeholder="09xx xxx xxx" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ nhận hàng</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <select required value={selectedProvince?.code || ''} onChange={handleProvinceChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary font-bold transition-all text-sm appearance-none cursor-pointer">
                      <option value="">Thành phố / Tỉnh</option>
                      {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                  </div>
                  <div className="relative">
                    <select required value={selectedDistrict?.code || ''} onChange={handleDistrictChange} disabled={!selectedProvince}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary font-bold transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">Quận / Huyện</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                  </div>
                  <div className="relative">
                    <select required value={selectedWard?.code || ''} onChange={handleWardChange} disabled={!selectedDistrict}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary font-bold transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">Phường / Xã</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                  </div>
                </div>
                <input required value={street} onChange={(e) => setStreet(e.target.value)} 
                  className="w-full px-7 py-4 mt-2 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary font-bold transition-all text-sm md:text-base" 
                  placeholder="Số nhà, tên ngõ/đường..." />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-4">
              <span className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-sm italic">02</span>
              Hình thức thanh toán
            </h2>
            <div className="space-y-4">
              <label className={`flex items-center gap-6 p-6 md:p-8 border-2 rounded-[32px] cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                <input type="radio" name="pay" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-6 h-6 accent-primary" />
                <div className="flex flex-col">
                  <span className="font-black text-sm md:text-base uppercase tracking-tight text-gray-900">Trả tiền mặt khi nhận hàng (COD)</span>
                  <span className="text-[10px] md:text-xs text-gray-400 font-bold italic">An tâm mua sắm, nhận hàng mới trả tiền</span>
                </div>
              </label>

              <div className={`border-2 rounded-[32px] transition-all overflow-hidden ${paymentMethod === 'Transfer' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-gray-100 bg-white'}`}>
                <label className="flex items-center gap-6 p-6 md:p-8 cursor-pointer" onClick={() => setPaymentMethod('Transfer')}>
                  <input type="radio" name="pay" checked={paymentMethod === 'Transfer'} onChange={() => setPaymentMethod('Transfer')} className="w-6 h-6 accent-primary" />
                  <div className="flex flex-col">
                    <span className="font-black text-sm md:text-base uppercase tracking-tight text-gray-900">Chuyển khoản / Quét mã QR</span>
                    <span className="text-[10px] md:text-xs text-primary font-bold italic uppercase tracking-widest">Xác nhận siêu tốc • Ưu tiên giao sớm</span>
                  </div>
                </label>

                {paymentMethod === 'Transfer' && (
                  <div className="px-6 md:px-10 pb-8 pt-2 grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                    <button 
                      type="button"
                      onClick={() => setTransferProvider('Momo')}
                      className={`group py-5 rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest border-2 transition-all flex flex-col items-center justify-center gap-3 ${transferProvider === 'Momo' ? 'bg-white border-primary text-primary shadow-xl shadow-primary/10' : 'bg-gray-50 border-transparent text-gray-400'}`}
                    >
                      <div className="w-12 h-12 p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                        <img src={MOMO_LOGO} className="w-full h-full object-contain" alt="Momo" />
                      </div>
                      VÍ MOMO
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTransferProvider('VNPay')}
                      className={`group py-5 rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest border-2 transition-all flex flex-col items-center justify-center gap-3 ${transferProvider === 'VNPay' ? 'bg-white border-primary text-primary shadow-xl shadow-primary/10' : 'bg-gray-50 border-transparent text-gray-400'}`}
                    >
                      <div className="w-12 h-12 p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                        <img src={VNPAY_LOGO} className="w-full h-full object-contain" alt="VNPay" />
                      </div>
                      VNPAY QR
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Order Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-white p-8 md:p-12 rounded-[48px] border border-gray-100 shadow-2xl shadow-blue-100/20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Giỏ hàng.</h2>
              <span className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                {cart.length} món
              </span>
            </div>

            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-6 mb-10 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex gap-5 items-center">
                    <div className="relative shrink-0">
                      <img src={item.image} className="w-16 h-16 rounded-[20px] object-cover border border-gray-100 group-hover:scale-105 transition-transform" />
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-sm line-clamp-1">{item.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <span className="font-black text-primary text-sm shrink-0">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-8 space-y-5">
              <div className="flex justify-between text-gray-400 font-bold text-xs uppercase tracking-widest">
                <span>Tạm tính</span>
                <span className="text-gray-900">{totalPrice.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold text-xs uppercase tracking-widest">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-black">MIỄN PHÍ</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-base font-black text-gray-900 uppercase italic tracking-tighter">Tổng thanh toán</span>
                <span className="text-4xl font-black text-primary tracking-tighter italic">{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full mt-12 bg-primary text-white py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-gray-900 shadow-2xl shadow-primary/40 transition-all disabled:opacity-50 transform active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  XỬ LÝ...
                </div>
              ) : paymentMethod === 'Transfer' ? 'TIẾN HÀNH QUÉT MÃ QR' : 'XÁC NHẬN ĐẶT HÀNG'}
            </button>
            
            <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
              🛡️ Giao dịch an toàn & bảo mật 100%
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
