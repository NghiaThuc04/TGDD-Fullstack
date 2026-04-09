import React, { useState } from 'react';
import AdminPolicyEditor from '../components/AdminPolicyEditor';

const POLICY_SLUGS = [
  { slug: 'huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { slug: 'thanh-toan', label: 'Thanh toán' },
  { slug: 'tra-hang-hoan-tien', label: 'Trả hàng & Hoàn tiền' },
  { slug: 'chinh-sach-bao-hanh', label: 'Chính sách bảo hành' },
  { slug: 'gioi-thieu', label: 'Giới thiệu OnlyBuyer' },
  { slug: 'dieu-khoan', label: 'Điều khoản sử dụng' },
  { slug: 'chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
];

const PolicyManager: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState(POLICY_SLUGS[0].slug);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Policies.</h2>
        <p className="text-gray-400 font-bold text-sm italic mt-1">
          Quản lý nội dung trang hỗ trợ & chính sách • {POLICY_SLUGS.length} trang
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar chọn trang */}
        <div className="w-full md:w-56 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
            {POLICY_SLUGS.map(item => (
              <button
                key={item.slug}
                onClick={() => setActiveSlug(item.slug)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeSlug === item.slug
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-grow bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <AdminPolicyEditor key={activeSlug} slug={activeSlug} />
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;
