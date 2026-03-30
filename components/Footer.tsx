
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'CHĂM SÓC KHÁCH HÀNG',
      links: [
        { label: 'Trung Tâm Trợ Giúp', url: '#' },
        { label: 'Hướng Dẫn Mua Hàng', url: '#' },
        { label: 'Hướng Dẫn Bán Hàng', url: '#' },
        { label: 'Thanh Toán', url: '#' },
        { label: 'Trả Hàng & Hoàn Tiền', url: '#' },
        { label: 'Chăm Sóc Khách Hàng', url: '#' },
        { label: 'Chính Sách Bảo Hành', url: '#' },
      ]
    },
    {
      title: 'VỀ ONLYBUYER',
      links: [
        { label: 'Giới Thiệu Website', url: '#' },
        { label: 'Tuyển Dụng', url: '#' },
        { label: 'Điều Khoản', url: '#' },
        { label: 'Chính Sách Bảo Mật', url: '#' },
        { label: 'Liên Hệ Truyền Thông', url: '#' },
      ]
    }
  ];

  const payments = [
    { name: 'Visa', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
    { name: 'MoMo', icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png' },
    { name: 'VNPay', icon: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg' }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section: Main Columns adjusted to grid-cols-4 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-16">
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-6 italic">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href={link.url} className="text-[12px] font-medium text-gray-500 hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Payment Column */}
          <div>
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-6 italic">THANH TOÁN</h4>
            <div className="grid grid-cols-3 gap-3">
              {payments.map((p, i) => (
                <div key={i} className="bg-white p-2 border border-gray-100 rounded-lg shadow-sm flex items-center justify-center h-10 hover:shadow-md transition-shadow">
                  <img src={p.icon} alt={p.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Social Column */}
          <div>
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-6 italic">THEO DÕI CHÚNG TÔI</h4>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50">
                  <span className="text-sm">📘</span>
                </div>
                <span className="text-[12px] font-bold">Facebook</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-50">
                  <span className="text-sm">📷</span>
                </div>
                <span className="text-[12px] font-bold">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Policies */}
        <div className="border-t border-gray-50 py-10">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10">
            <Link to="#" className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">CHÍNH SÁCH BẢO MẬT</Link>
            <Link to="#" className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">QUY CHẾ HOẠT ĐỘNG</Link>
            <Link to="#" className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">CHÍNH SÁCH VẬN CHUYỂN</Link>
            <Link to="#" className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">CHÍNH SÁCH TRẢ HÀNG & HOÀN TIỀN</Link>
          </div>

          {/* Legal Info Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Công ty TNHH OnlyBuyer Việt Nam
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                Địa chỉ: Tầng 72, Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center pt-8 border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            © 2026 - OnlyBuyer. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
