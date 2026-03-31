
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { getAllOrdersApi, updateOrderStatusApi, deleteOrderApi, updateOrderApi, getStaffListApi } from '../services/api';
import { Order, User } from '../types';

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string; dot: string }> = {
  pending:   { label: 'Chờ xử lý',   color: 'bg-orange-100 text-orange-600 border-orange-200', dot: 'bg-orange-400' },
  paid:      { label: 'Đã nhận tiền', color: 'bg-blue-100 text-blue-600 border-blue-200',     dot: 'bg-blue-500' },
  shipping:  { label: 'Đang giao',    color: 'bg-purple-100 text-purple-600 border-purple-200', dot: 'bg-purple-500' },
  completed: { label: 'Hoàn tất',     color: 'bg-green-100 text-green-600 border-green-200',  dot: 'bg-green-500' },
  cancelled: { label: 'Đã hủy',       color: 'bg-red-100 text-red-500 border-red-200',        dot: 'bg-red-400' },
};

const OrderManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffs, setStaffs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ customerName: '', customerPhone: '', address: '', paymentMethod: '' });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
      getStaffListApi().then(setStaffs).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersApi();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setProcessingId(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) { alert('Lỗi cập nhật trạng thái!'); }
    finally { setProcessingId(null); }
  };

  const handleDelete = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      await deleteOrderApi(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) { alert('Lỗi xóa đơn hàng!'); }
    finally { setProcessingId(null); setConfirmDelete(null); }
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsEditing(false);
    setEditForm({
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      address: order.address || '',
      paymentMethod: order.paymentMethod || 'COD'
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder) return;
    
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(editForm.customerPhone.trim())) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.");
      return;
    }

    setProcessingId(selectedOrder.id);
    try {
      const updated = await updateOrderApi(selectedOrder.id, editForm);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setSelectedOrder(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Lỗi cập nhật thông tin đơn hàng!');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />;

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
        <div>
          <nav className="text-[10px] font-black text-gray-400 mb-3 flex gap-2 uppercase tracking-widest">
            <Link to="/admin" className="hover:text-primary transition-colors">BẢN ĐIỀU KHIỂN</Link>
            <span>/</span>
            <span className="text-primary italic">QUẢN LÝ ĐƠN HÀNG</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Orders.</h1>
          <p className="text-gray-400 font-bold text-sm mt-1 italic">{orders.length} đơn hàng tổng cộng</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-2 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 overflow-x-auto max-w-full no-scrollbar gap-1">
          {(['all', 'pending', 'paid', 'shipping', 'completed', 'cancelled'] as const).map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? `Tất cả (${orders.length})` :
               tab === 'pending' ? `Chờ (${orders.filter(o=>o.status==='pending').length})` :
               tab === 'paid' ? `Thu tiền (${orders.filter(o=>o.status==='paid').length})` :
               tab === 'shipping' ? `Giao (${orders.filter(o=>o.status==='shipping').length})` :
               tab === 'completed' ? `Xong (${orders.filter(o=>o.status==='completed').length})` :
               `Hủy (${orders.filter(o=>o.status==='cancelled').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      {loading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="font-black text-gray-400 uppercase tracking-widest text-xs italic">Đang tải đơn hàng...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[48px] border-2 border-dashed border-gray-100 p-24 text-center">
          <span className="text-6xl grayscale opacity-20 block mb-6">📦</span>
          <p className="text-gray-300 font-black uppercase tracking-widest text-sm italic">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_2fr_1fr_1fr_auto] gap-4 px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>Khách hàng / Mã đơn</span>
            <span>Sản phẩm</span>
            <span>Địa chỉ</span>
            <span>Giá trị</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>

          {filtered.map(order => {
            const sc = STATUS_CONFIG[order.status];
            const productSummary = order.items.slice(0, 2).map(i => i.name).join(', ') +
              (order.items.length > 2 ? ` +${order.items.length - 2} khác` : '');

            return (
              <div key={order.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_2fr_1fr_1fr_auto] gap-4 items-center px-6 py-5">
                  {/* Col 1: Customer + Order ID */}
                  <div>
                    <p className="font-black text-gray-900 text-sm">{order.customerName || 'Khách hàng'}</p>
                    <p className="text-[11px] font-black text-primary italic mt-0.5">#{order.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>

                  {/* Col 2: Products */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 line-clamp-2 leading-relaxed">{productSummary}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">{order.items.length} sản phẩm • {order.paymentMethod === 'Transfer' ? `🔵 ${order.transferProvider}` : '🟠 COD'}</p>
                  </div>

                  {/* Col 3: Address */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 line-clamp-2 leading-relaxed">{order.address}</p>
                    <p className="text-[10px] text-primary font-bold mt-1">{order.customerPhone}</p>
                  </div>

                  {/* Col 4: Price */}
                  <div>
                    <p className="text-lg font-black text-primary tracking-tight italic">{order.total.toLocaleString()}đ</p>
                  </div>

                  {/* Col 5: Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${sc.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                      {sc.label}
                    </span>
                  </div>

                  {/* Col 6: Action */}
                  <div>
                    <button
                      onClick={() => handleOpenDetail(order)}
                      className="bg-primary/10 text-primary px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                    >
                      Chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Detail Popup Modal ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />

          <div className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in fade-in duration-300">
            {/* Modal Header */}
            <div className="p-6 md:p-10 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Đơn hàng chi tiết</p>
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight italic">#{selectedOrder.id}</h2>
                <p className="text-xs text-gray-400 font-bold mt-1">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div className="flex items-center gap-3">
                {selectedOrder.handlerId && (
                   <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl font-bold uppercase tracking-widest hidden md:inline-block border border-gray-200">
                     Xử lý bởi: {staffs.find(s => s.id === selectedOrder.handlerId)?.name || 'Nhân sự'}
                   </span>
                )}
                <span className={`text-[10px] font-black px-4 py-2 rounded-2xl border-2 uppercase tracking-widest ${STATUS_CONFIG[selectedOrder.status].color}`}>
                  {STATUS_CONFIG[selectedOrder.status].label}
                </span>
                <button onClick={() => setSelectedOrder(null)}
                  className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:rotate-90 transition-all shadow-sm text-xl font-black shrink-0"
                >×</button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Sản phẩm (Top) & Thông tin (Bottom) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* TOP LEFT: SẢN PHẨM ĐẶT MUA */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-4">Sản phẩm đặt mua ({selectedOrder.items.length})</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                          <div className="relative shrink-0">
                            <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-grow">
                            <p className="text-xs font-black text-gray-900">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                            <p className="text-xs font-black text-primary mt-1">{item.price.toLocaleString()}đ × {item.quantity} = {(item.price * item.quantity).toLocaleString()}đ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BOTTOM LEFT: THÔNG TIN ĐƠN HÀNG */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thông tin giao hàng</h3>
                      {!isEditing ? (
                         <button onClick={() => setIsEditing(true)} className="text-[10px] font-black text-primary hover:underline uppercase px-4 py-2 bg-primary/10 rounded-xl">Sửa thông tin</button>
                      ) : (
                         <button onClick={() => setIsEditing(false)} className="text-[10px] font-black text-red-500 hover:bg-red-50 bg-white border border-red-100 uppercase px-4 py-2 rounded-xl transition-all">Hủy sửa</button>
                      )}
                    </div>
   
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Người nhận</label>
                            <input className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:border-primary border border-transparent font-bold text-xs" 
                              value={editForm.customerName} onChange={e => setEditForm({...editForm, customerName: e.target.value})} placeholder="Tên" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Điện thoại</label>
                            <input type="tel" maxLength={10} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:border-primary border border-transparent font-bold text-xs" 
                              value={editForm.customerPhone} onChange={e => setEditForm({...editForm, customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="SĐT" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Thanh toán</label>
                            <select className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:border-primary border border-transparent font-bold text-xs" 
                              value={editForm.paymentMethod} onChange={e => setEditForm({...editForm, paymentMethod: e.target.value})}>
                              <option value="COD">COD - Tiền mặt</option>
                              <option value="Transfer">Chuyển khoản</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Địa chỉ</label>
                          <textarea className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:border-primary border border-transparent font-bold text-xs h-20 resize-none" 
                            value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} placeholder="Địa chỉ chi tiết" />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button disabled={!!processingId} onClick={handleSaveEdit} 
                            className="bg-primary text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                            {processingId ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl shrink-0">👤</div>
                          <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Người nhận</p><p className="text-sm font-black text-gray-900 mt-0.5">{selectedOrder.customerName}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-xl shrink-0">📞</div>
                          <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Điện thoại</p><p className="text-sm font-black text-gray-900 mt-0.5">{selectedOrder.customerPhone}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-xl shrink-0">💳</div>
                          <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Thanh toán</p><p className="text-xs font-black text-gray-900 mt-0.5">{selectedOrder.paymentMethod === 'Transfer' ? selectedOrder.transferProvider : 'COD - Tiền mặt'}</p></div>
                        </div>
                        <div className="flex items-start gap-4 col-span-1 md:col-span-2">
                          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-xl shrink-0">📍</div>
                          <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Địa chỉ giao hàng</p><p className="text-xs font-bold text-gray-600 leading-relaxed">{selectedOrder.address}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Tổng tiền (Top) & Hành động (Bottom) */}
                <div className="space-y-8">
                  {/* TOP RIGHT: TỔNG THANH TOÁN */}
                  <div className="bg-gray-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-gray-900/10">
                    <div className="flex justify-between text-[11px] font-bold text-white/50 mb-3"><span>TẠM TÍNH</span><span className="text-white">{selectedOrder.total.toLocaleString()}đ</span></div>
                    <div className="flex justify-between text-[11px] font-bold text-white/50 mb-6"><span>VẬN CHUYỂN</span><span className="text-green-400 uppercase italic">Freeship</span></div>
                    <hr className="border-white/10 mb-6" />
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Tổng thanh toán</span>
                      <span className="text-3xl font-black text-primary tracking-tight italic">{selectedOrder.total.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* BOTTOM RIGHT: HÀNH ĐỘNG */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-4">Cập nhật trạng thái</h3>
                      {selectedOrder.status === 'pending' && selectedOrder.paymentMethod === 'Transfer' && (
                        <button disabled={!!processingId} onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
                        >{processingId ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : '💰'} Đã nhận tiền chuyển khoản</button>
                      )}
                      {(selectedOrder.status === 'paid' || (selectedOrder.status === 'pending' && selectedOrder.paymentMethod === 'COD')) && (
                        <button disabled={!!processingId} onClick={() => handleUpdateStatus(selectedOrder.id, 'shipping')}
                          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >{processingId ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : '🚚'} Bàn giao shipper</button>
                      )}
                      {selectedOrder.status === 'shipping' && (
                        <button disabled={!!processingId} onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                          className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >{processingId ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : '✅'} Hoàn tất giao hàng</button>
                      )}
                      {['pending', 'paid'].includes(selectedOrder.status) && (
                        <button disabled={!!processingId} onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                          className="w-full bg-orange-50 text-orange-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                        >❌ Hủy đơn hàng</button>
                      )}
                    </div>

                    {/* Xóa đơn hàng */}
                    <div>
                      {confirmDelete === selectedOrder.id ? (
                        <div className="bg-red-50 rounded-2xl p-5 border border-red-100 space-y-4">
                          <p className="text-xs font-black text-red-600 text-center uppercase tracking-widest">⚠️ Xác nhận xóa?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-black text-[10px] text-gray-500 hover:bg-gray-50 transition-all uppercase">Hủy</button>
                            <button disabled={!!processingId} onClick={() => handleDelete(selectedOrder.id)}
                              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                            >Xóa ngay</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(selectedOrder.id)}
                          className="w-full bg-red-50/50 text-red-400 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-dashed border-red-200 shadow-sm"
                        >🗑 Xóa đơn hàng này</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
