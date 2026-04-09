import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { policyData } from '../data/policyData';

const SupportDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Cuộn lên đầu trang khi component mount hoặc khi slug thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Nếu không có slug hoặc slug không tồn tại trong dữ liệu, chuyển hướng về trang chủ
  if (!slug || !policyData[slug]) {
    return <Navigate to="/" replace />;
  }

  const { title, content } = policyData[slug];

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">
          {title}
        </h1>
        <div 
          className="
            text-gray-600 leading-relaxed
            [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-4
            [&_p]:mb-5 [&_p]:text-gray-600 [&_p]:text-[15px]
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2
            [&_li]:text-gray-600 [&_li]:marker:text-blue-500 [&_li]:text-[15px]
            [&_strong]:text-gray-900 [&_strong]:font-semibold
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default SupportDetailPage;
