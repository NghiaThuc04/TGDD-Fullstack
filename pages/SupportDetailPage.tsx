import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://tgdd-fullstack.onrender.com/api';

interface PolicyContent {
  title: string;
  content: string;
}

const SupportDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<PolicyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    setLoading(true);
    setNotFound(false);

    fetch(`${BASE_URL}/policies/${slug}`)
      .then(async res => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data) setPolicy(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đang tải nội dung...</p>
        </div>
      </div>
    );
  }

  // 404 Not Found
  if (notFound || !policy) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-6 px-4">
        <span className="text-7xl">🔍</span>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy trang</h2>
          <p className="text-gray-400 font-medium text-sm mb-6">Trang hỗ trợ bạn đang tìm không tồn tại hoặc đã bị gỡ bỏ.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-primary/20"
          >
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[10px] font-black text-gray-400 mb-8 flex gap-2 uppercase tracking-widest">
          <span
            className="hover:text-primary cursor-pointer transition-colors"
            onClick={() => navigate('/')}
          >
            Trang chủ
          </span>
          <span>/</span>
          <span className="text-primary">{policy.title}</span>
        </nav>

        {/* Nội dung chính */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">
            {policy.title}
          </h1>

          {/* Render HTML từ Rich Text Editor */}
          <div
            className="
              text-gray-600 leading-relaxed
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-4
              [&_p]:mb-5 [&_p]:text-gray-600 [&_p]:text-[15px]
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-2
              [&_li]:text-gray-600 [&_li]:marker:text-primary [&_li]:text-[15px]
              [&_strong]:text-gray-900 [&_strong]:font-semibold
              [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-75
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500
            "
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </div>

        {/* Nút quay lại */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportDetailPage;
