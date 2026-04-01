
import React, { useEffect, useState } from 'react';
import { getStaffListApi, createStaffApi, updateStaffApi, deleteStaffApi, getStaffActivitiesApi } from '../services/api';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../constants';

const PERMISSION_OPTIONS = [
  { key: 'order_confirm', label: '✅ Xác nhận đơn hàng' },
  { key: 'manage_products', label: '📦 Quản lý sản phẩm' },
  { key: 'post_article', label: '📝 Đăng bài viết' },
  { key: 'view_reports', label: '📊 Xem báo cáo' },
  { key: 'all', label: '🔑 Toàn quyền (Admin)' },
];

interface StaffForm {
  name: string;
  username: string;
  password: string;
  role: 'staff' | 'admin';
  permissions: string[];
}

const defaultForm: StaffForm = { name: '', username: '', password: '', role: 'staff', permissions: [] };

const StaffManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<StaffForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Activity State
  const [activityUser, setActivityUser] = useState<User | null>(null);
  const [activitiesData, setActivitiesData] = useState<any>(null);
  const [loadingActivities, setLoadingActivities] = useState(false);

  if (currentUser?.role !== ROLES.ADMIN) return <Navigate to="/" replace />;

  useEffect(() => { loadStaff(); }, []);
  const loadStaff = async () => {
    setLoading(true);
    try { setStaff(await getStaffListApi()); } finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm(defaultForm);
    setEditingUser(null);
    setIsCreating(true);
    setError('');
  };

  const openEdit = (u: User) => {
    setForm({ name: u.name, username: u.username, password: '', role: u.role as 'staff' | 'admin', permissions: u.permissions || [] });
    setEditingUser(u);
    setIsCreating(false);
    setError('');
  };

  const closeModal = () => { setIsCreating(false); setEditingUser(null); setError(''); };

  const togglePermission = (key: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key) ? prev.permissions.filter(p => p !== key) : [...prev.permissions, key]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isCreating) {
        if (!form.password) { setError('Vui lòng nhập mật khẩu'); setSaving(false); return; }
        await createStaffApi({ ...form });
      } else if (editingUser) {
        const payload: any = { name: form.name, role: form.role, permissions: form.permissions };
        if (form.password) payload.password = form.password;
        await updateStaffApi(editingUser.id, payload);
      }
      await loadStaff();
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu dữ liệu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteStaffApi(id);
      setStaff(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa nhân viên!');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const openActivities = async (user: User) => {
    setActivityUser(user);
    setActivitiesData(null);
    setLoadingActivities(true);
    try {
      const data = await getStaffActivitiesApi(user.id);
      setActivitiesData(data);
    } catch (err: any) {
      alert('Lỗi tải báo cáo: ' + err.message);
    } finally {
      setLoadingActivities(false);
    }
  };

  const adminList = staff.filter(u => u.role === ROLES.ADMIN);
  const staffList = staff.filter(u => u.role === ROLES.STAFF);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Nhân sự.</h2>
          <p className="text-gray-400 font-bold text-sm italic mt-1">{staff.length} tài khoản • {adminList.length} admin • {staffList.length} nhân viên</p>
        </div>
        <button onClick={openCreate}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:-translate-y-1 transition-all"
        >+ THÊM NHÂN VIÊN</button>
      </div>

      {loading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="font-black text-gray-400 uppercase tracking-widest text-xs italic">Đang tải danh sách...</span>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Admin Section */}
          {adminList.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-yellow-400 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-yellow-100">👑</div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Quản trị viên</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{adminList.length} tài khoản có toàn quyền</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {adminList.map(u => <StaffCard key={u.id} user={u} currentUser={currentUser} onEdit={openEdit} onDelete={setConfirmDelete} confirmDelete={confirmDelete} deletingId={deletingId} onConfirmDelete={handleDelete} onCancelDelete={() => setConfirmDelete(null)} onViewActivities={openActivities} />)}
              </div>
            </div>
          )}

          {/* Staff Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-primary/20">👷</div>
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Nhân viên</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{staffList.length} tài khoản</p>
              </div>
            </div>
            {staffList.length === 0 ? (
              <div className="py-16 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest italic mb-4">Chưa có nhân viên nào</p>
                <button onClick={openCreate} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">+ Thêm nhân viên đầu tiên</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {staffList.map(u => <StaffCard key={u.id} user={u} currentUser={currentUser} onEdit={openEdit} onDelete={setConfirmDelete} confirmDelete={confirmDelete} deletingId={deletingId} onConfirmDelete={handleDelete} onCancelDelete={() => setConfirmDelete(null)} onViewActivities={openActivities} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Create/Edit Modal ─── */}
      {(isCreating || editingUser) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={closeModal} />
          <form onSubmit={handleSave}
            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] p-8 md:p-10 shadow-2xl space-y-7 animate-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quản lý nhân sự</p>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  {isCreating ? 'Thêm nhân viên mới' : `Sửa: ${editingUser?.name}`}
                </h3>
              </div>
              <button type="button" onClick={closeModal}
                className="w-12 h-12 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:rotate-90 transition-all font-black text-xl"
              >×</button>
            </div>

            {error && <p className="bg-red-50 text-red-500 px-5 py-3 rounded-2xl text-xs font-bold border border-red-100">⚠️ {error}</p>}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Họ và tên *</label>
                  <input required placeholder="Nguyễn Văn A..."
                    className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên đăng nhập {isCreating ? '*' : ''}</label>
                  <input placeholder="staff_nguyen..." disabled={!isCreating}
                    className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  />
                  {!isCreating && <p className="text-[9px] text-gray-400 font-bold italic">Tên đăng nhập không thể thay đổi</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Mật khẩu {isCreating ? '*' : '(để trống nếu không đổi)'}
                </label>
                <input type="password" placeholder={isCreating ? 'Nhập mật khẩu...' : '••••••••'}
                  className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primary font-bold transition-all text-sm"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò *</label>
                <div className="flex gap-3">
                  {(['staff', 'admin'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                      className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${form.role === r ? (r === ROLES.ADMIN ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-primary text-white border-primary') : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}
                    >{r === ROLES.ADMIN ? '👑 Admin' : '👷 Nhân viên'}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phân quyền chi tiết</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PERMISSION_OPTIONS.map(opt => (
                    <button key={opt.key} type="button" onClick={() => togglePermission(opt.key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 font-bold text-xs transition-all text-left ${form.permissions.includes(opt.key) ? 'bg-primary/10 text-primary border-primary/30' : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-100'}`}
                    >
                      <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 text-[9px] transition-colors ${form.permissions.includes(opt.key) ? 'bg-primary border-primary text-white' : 'border-gray-200'}`}>
                        {form.permissions.includes(opt.key) ? '✓' : ''}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-gray-50 pt-6">
              <button type="button" onClick={closeModal}
                className="px-8 py-3.5 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
              >Hủy</button>
              <button type="submit" disabled={saving}
                className="bg-primary text-white px-12 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-60 flex items-center gap-3"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? 'Đang lưu...' : isCreating ? 'Tạo tài khoản 🚀' : 'Lưu thay đổi 💾'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Activity Modal ─── */}
      {activityUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setActivityUser(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] p-8 md:p-10 shadow-2xl space-y-7 animate-in zoom-in duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-50 pb-6">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-black">{activityUser.name.charAt(0)}</div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Báo cáo hiệu suất KPIs</p>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">{activityUser.name} <span className="text-sm border-2 border-gray-100 px-2 py-1 rounded-xl bg-gray-50 non-italic">@{activityUser.username}</span></h3>
                 </div>
              </div>
              <button onClick={() => setActivityUser(null)} className="w-12 h-12 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:rotate-90 transition-all font-black text-xl">×</button>
            </div>

            {loadingActivities ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                 <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                 <span className="font-black text-gray-400 uppercase tracking-widest text-xs italic">Đang tải báo cáo...</span>
              </div>
            ) : activitiesData ? (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10">
                     <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Đơn Hoàn Thành</p>
                     <p className="text-3xl font-black text-gray-900 italic">{activitiesData.stats.totalOrders}</p>
                   </div>
                   <div className="bg-green-50 rounded-3xl p-5 border border-green-100">
                     <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-2">Doanh Thu Mang Về</p>
                     <p className="text-xl md:text-2xl font-black text-green-700 italic">{(activitiesData.stats.totalSales || 0).toLocaleString()}đ</p>
                   </div>
                   <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
                     <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest mb-2">Máy / Sản Phẩm Đã Bán</p>
                     <p className="text-3xl font-black text-orange-700 italic">{activitiesData.stats.totalProductsSold}</p>
                   </div>
                   <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100">
                     <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-2">Tin Tức / Bài Viết</p>
                     <p className="text-3xl font-black text-purple-700 italic">{activitiesData.stats.totalArticles}</p>
                   </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-2">Danh sách các Đơn vị Mua do Staff chốt</h4>
                  {activitiesData.handledOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Nhân viên này chưa xử lý đơn hàng nào.</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                       {activitiesData.handledOrders.map((o: any) => (
                         <div key={o.id} className="flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                           <div>
                             <p className="font-black text-sm uppercase">{o.id} <span className="text-[10px] text-gray-400 non-italic ml-2">{new Date(o.createdAt).toLocaleString()}</span></p>
                             <p className="text-xs text-gray-500 font-medium">Khách hàng: {o.customerName} - {o.phoneNumber}</p>
                           </div>
                           <div className="text-right">
                             <p className="font-black text-green-600 text-lg">{o.total.toLocaleString()} đ</p>
                             <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase border ${o.status === 'completed' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-yellow-100 text-yellow-600 border-yellow-200'}`}>{o.status}</span>
                           </div>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                {/* Articles List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-2">Danh sách Bài viết Marketing đã đăng tải</h4>
                  {activitiesData.articles.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Chưa đăng tải bài viết nào.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                      {activitiesData.articles.map((a: any) => (
                        <div key={a.id} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-4 items-center">
                          {a.thumbnail && <img src={a.thumbnail} className="w-12 h-12 object-cover rounded-xl" />}
                          <div>
                            <p className="font-black text-sm text-indigo-900 leading-tight">{a.title}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Staff Card Component ───
interface CardProps {
  user: User;
  currentUser: User | null;
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
  confirmDelete: string | null;
  deletingId: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
  onViewActivities: (u: User) => void;
}

const StaffCard: React.FC<CardProps> = ({ user, currentUser, onEdit, onDelete, confirmDelete, deletingId, onConfirmDelete, onCancelDelete, onViewActivities }) => {
  const isSelf = user.id === currentUser?.id;
  const isAdmin = user.role === ROLES.ADMIN;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group">
      {/* Top: Avatar + Info */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 ${isAdmin ? 'bg-yellow-50 shadow-yellow-100' : 'bg-blue-50 shadow-blue-100'}`}>
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" /> : (isAdmin ? '👑' : '👤')}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-black text-gray-900 text-sm leading-tight truncate">{user.name}</h4>
            {isSelf && <span className="text-[9px] bg-green-100 text-green-600 font-black px-2 py-0.5 rounded-lg uppercase italic">Bạn</span>}
          </div>
          <p className="text-[10px] text-gray-400 font-bold italic">@{user.username}</p>
          <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${isAdmin ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
            {isAdmin ? '👑 Admin' : '👷 Nhân viên'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <button onClick={() => onViewActivities(user)} className="col-span-2 bg-primary/10 text-primary py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
          📊 XEM BÁO CÁO NHÂN SỰ NÀY
        </button>
      </div>

      {/* Permissions */}
      {user.permissions && user.permissions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.permissions.map(p => (
            <span key={p} className="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase tracking-wider">
              {PERMISSION_OPTIONS.find(o => o.key === p)?.label.split(' ').slice(1).join(' ') || p}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 border-t border-gray-50 pt-4">
        <button onClick={() => onEdit(user)}
          className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
        >✎ Sửa</button>

        {!isSelf && (confirmDelete === user.id ? (
          <div className="flex gap-1.5">
            <button onClick={onCancelDelete} className="px-3 py-2.5 bg-gray-100 rounded-xl font-black text-[9px] text-gray-400 hover:bg-gray-200 transition-all">Hủy</button>
            <button onClick={() => onConfirmDelete(user.id)} disabled={deletingId === user.id}
              className="px-3 py-2.5 bg-red-500 text-white rounded-xl font-black text-[9px] uppercase disabled:opacity-50 hover:bg-red-600 transition-all"
            >{deletingId === user.id ? '...' : 'Xóa!'}</button>
          </div>
        ) : (
          <button onClick={() => onDelete(user.id)}
            className="px-4 py-2.5 bg-red-50 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >🗑</button>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;
