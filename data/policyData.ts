export interface PolicyContent {
  title: string;
  content: string;
}

export const policyData: Record<string, PolicyContent> = {
  'huong-dan-mua-hang': {
    title: 'Hướng dẫn mua hàng',
    content: `
      <h3>1. Tìm kiếm sản phẩm</h3>
      <p>Bạn có thể tìm kiếm sản phẩm theo tên, danh mục hoặc sử dụng thanh tìm kiếm trực tiếp trên trang chủ.</p>
      <h3>2. Thêm vào giỏ hàng</h3>
      <p>Khi đã chọn được sản phẩm ưng ý, bấm vào nút <strong>Thêm vào giỏ hàng</strong>. Bạn có thể tiếp tục mua sắm hoặc tiến hành thanh toán.</p>
      <h3>3. Tiến hành thanh toán</h3>
      <p>Vào giỏ hàng của bạn, kiểm tra lại thông tin sản phẩm và bấm <strong>Thanh toán</strong>. Điền đầy đủ thông tin giao hàng để hoàn tất đặt hàng.</p>
    `
  },
  'thanh-toan': {
    title: 'Hình thức thanh toán',
    content: `
      <h3>1. Thanh toán khi nhận hàng (COD)</h3>
      <p>Khách hàng thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận được sản phẩm.</p>
      <h3>2. Thanh toán chuyển khoản</h3>
      <p>Quý khách có thể chuyển khoản vào các tài khoản ngân hàng của chúng tôi. Thông tin tài khoản sẽ được hiển thị khi khách hàng chọn phương thức này lúc thanh toán.</p>
      <h3>3. Thanh toán qua ví điện tử</h3>
      <p>Chúng tôi hỗ trợ các ví điện tử phổ biến như Momo, ZaloPay, VNPAY.</p>
    `
  },
  'tra-hang-hoan-tien': {
    title: 'Chính sách trả hàng & hoàn tiền',
    content: `
      <h3>1. Điều kiện trả hàng</h3>
      <ul>
        <li>Sản phẩm bị lỗi do nhà sản xuất.</li>
        <li>Sản phẩm không đúng với thông tin đặt hàng (sai kích thước, màu sắc, model).</li>
        <li>Thời gian yêu cầu trả hàng: trong vòng 7 ngày kể từ khi nhận hàng.</li>
      </ul>
      <h3>2. Quy trình xử lý hoàn tiền</h3>
      <p>Sau khi nhận được hàng trả về và kiểm tra hợp lệ, chúng tôi sẽ tiến hành hoàn tiền vào tài khoản hoặc thẻ của quý khách trong vòng 3-5 ngày làm việc.</p>
    `
  },
  'chinh-sach-bao-hanh': {
    title: 'Chính sách bảo hành',
    content: `
      <h3>1. Thời hạn bảo hành</h3>
      <p>Tất cả sản phẩm điện tử tại OnlyBuyer đều được bảo hành từ 6 tháng đến 2 năm tùy thuộc vào nhà sản xuất.</p>
      <h3>2. Điều kiện bảo hành</h3>
      <ul>
        <li>Sản phẩm còn trong thời hạn bảo hành.</li>
        <li>Tem bảo hành, serial number còn nguyên vẹn, không có dấu hiệu cạo sửa, chắp vá.</li>
        <li>Sản phẩm không bị rơi rớt, va đập, vô nước hoặc hư hỏng do lỗi người sử dụng.</li>
      </ul>
    `
  },
  'gioi-thieu': {
    title: 'Giới thiệu về OnlyBuyer',
    content: `
      <h3>Về chúng tôi</h3>
      <p><strong>OnlyBuyer</strong> là nền tảng thương mại điện tử chuyên cung cấp các thiết bị điện tử, công nghệ chính hãng với giá cả cạnh tranh và dịch vụ chăm sóc khách hàng chuyên nghiệp.</p>
      <h3>Tầm nhìn & Sứ mệnh</h3>
      <ul>
        <li><strong>Tầm nhìn:</strong> Trở thành điểm đến mua sắm đồ công nghệ trực tuyến số 1 tại Việt Nam.</li>
        <li><strong>Sứ mệnh:</strong> Mang đến cho khách hàng trải nghiệm mua sắm tiện lợi, an toàn cùng những sản phẩm chất lượng tốt nhất.</li>
      </ul>
    `
  },
  'dieu-khoan': {
    title: 'Điều khoản sử dụng',
    content: `
      <h3>1. Chấp nhận các điều khoản</h3>
      <p>Khi truy cập và sử dụng trang web của OnlyBuyer, khách hàng cần đồng ý tuân thủ các quy định và điều khoản của chúng tôi.</p>
      <h3>2. Quyền sở hữu trí tuệ</h3>
      <p>Mọi hình ảnh, nội dung và tài sản trí tuệ trên website này đều thuộc quyền sở hữu của OnlyBuyer và được bảo vệ bởi pháp luật.</p>
      <h3>3. Trách nhiệm người dùng</h3>
      <p>Người dùng không được thực hiện các hành vi gian lận, phát tán mã độc hoặc gây hại đến hệ thống máy chủ của website.</p>
    `
  },
  'chinh-sach-bao-mat': {
    title: 'Chính sách bảo mật',
    content: `
      <h3>1. Thu thập thông tin</h3>
      <p>Chúng tôi chỉ thu thập thông tin cần thiết như tên, số điện thoại, địa chỉ email, địa chỉ giao hàng để hỗ trợ cho việc giao nhận và chăm sóc khách hàng.</p>
      <h3>2. Bảo mật thông tin</h3>
      <p>Thông tin của khách hàng sẽ được mã hóa và bảo mật bằng công nghệ tiên tiến nhất, đảm bảo không tiết lộ cho bên thứ ba vì mục đích thương mại.</p>
      <h3>3. Quyền lợi khách hàng</h3>
      <p>Khách hàng có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bất kỳ lúc nào.</p>
    `
  }
};
