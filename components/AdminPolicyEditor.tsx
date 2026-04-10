import React, { useState, useEffect, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://tgdd-fullstack.onrender.com/api';
const getToken = () => localStorage.getItem('ob_jwt_token');

interface AdminPolicyEditorProps {
  slug: string;
}

const AdminPolicyEditor: React.FC<AdminPolicyEditorProps> = ({ slug }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Dùng ref để giữ instance của Quill tránh re-render
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  // Hiển thị toast tự động ẩn sau 3s
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load dữ liệu từ API
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/policies/${slug}`)
      .then(res => {
        if (res.status === 404) return null;
        return res.json();
      })
      .then(data => {
        if (data) {
          setTitle(data.title || '');
          setContent(data.content || '');
        }
      })
      .catch(() => showToast('Không thể tải dữ liệu từ server', 'error'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Khởi tạo Quill sau khi component mount và thư viện load xong
  useEffect(() => {
    if (loading) return;
    // Lazy-load Quill từ CDN để không cần npm install
    if (!document.getElementById('quill-css')) {
      const link = document.createElement('link');
      link.id = 'quill-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
      document.head.appendChild(link);
    }
    if (!(window as any).Quill) {
      const script = document.createElement('script');
      script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js';
      script.onload = () => initQuill();
      document.body.appendChild(script);
    } else {
      initQuill();
    }
  }, [loading]);

  const initQuill = () => {
    if (!editorRef.current || quillRef.current) return;
    const Quill = (window as any).Quill;
    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
      placeholder: 'Nhập nội dung trang chính sách...',
    });
    // Fill nội dung ban đầu
    quillRef.current.clipboard.dangerouslyPasteHTML(content);
    // Lắng nghe thay đổi
    quillRef.current.on('text-change', () => {
      setContent(quillRef.current.root.innerHTML);
    });
  };

  const handleSave = async () => {
    if (!title.trim()) return showToast('Tiêu đề không được để trống!', 'error');
    const finalContent = quillRef.current ? quillRef.current.root.innerHTML : content;
    if (!finalContent || finalContent === '<p><br></p>') return showToast('Nội dung không được để trống!', 'error');

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/policies/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, content: finalContent }),
      });
      if (!res.ok) {
         const errData = await res.json().catch(() => ({}));
         throw new Error(errData.message || `Lỗi ${res.status}: Không kết nối được API`);
      }
      showToast('✅ Lưu thành công!', 'success');
    } catch (err: any) {
      showToast(`❌ Lưu thất bại: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 font-bold">
        <span className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin mr-3" />
        Đang tải nội dung...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toast thông báo */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[999] px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm transition-all animate-in slide-in-from-top-2 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Slug badge (chỉ đọc) */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Slug:</span>
        <code className="bg-gray-100 text-primary text-xs font-bold px-3 py-1 rounded-lg">{slug}</code>
      </div>

      {/* Tiêu đề */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiêu đề trang *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="VD: Hướng dẫn mua hàng"
          className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold text-sm transition-all"
        />
      </div>

      {/* Rich Text Editor */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nội dung *</label>
        <div className="rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-primary transition-all">
          <div ref={editorRef} style={{ minHeight: '320px', fontSize: '14px' }} />
        </div>
      </div>

      {/* Nút lưu */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-3"
        >
          {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {saving ? 'Đang lưu...' : 'Lưu nội dung 💾'}
        </button>
      </div>
    </div>
  );
};

export default AdminPolicyEditor;
