# Báo Cáo Tổng Kết Dự Án: Hệ thống Đặt Đồ Ăn Nhanh Trực Tuyến (FastBite)

## 1. Tóm tắt nội dung Project
**FastBite** là một hệ thống ứng dụng web thương mại điện tử chuyên cung cấp dịch vụ đặt đồ ăn nhanh và đồ uống trực tuyến. 
Dự án được xây dựng với mục tiêu mang lại trải nghiệm mua sắm mượt mà, tiện lợi cho khách hàng với giao diện bắt mắt, tính năng giỏ hàng, thanh toán trực tuyến, quản lý đơn hàng. Đồng thời cung cấp cho người quản trị (Admin) một hệ thống quản lý toàn diện từ sản phẩm, danh mục, mã giảm giá đến các bài viết tin tức và phản hồi liên hệ.

## 2. Các Công Nghệ & Kỹ Thuật Sử Dụng

### 2.1. Phía Frontend (Giao diện người dùng)
- **Framework:** Next.js 15 (App Router), React 19.
- **Ngôn ngữ:** TypeScript.
- **Styling:** Tailwind CSS (kết hợp các biến CSS thuần để tạo màu sắc thương hiệu Đỏ/Cam phong cách Fast Food).
- **Quản lý State:** Zustand (Quản lý giỏ hàng `cartStore` và trạng thái người dùng `authStore`).
- **Xác thực (Authentication):** Clerk (Hỗ trợ đăng nhập, đăng ký, đăng nhập bằng Google/Social login nhanh chóng, an toàn).
- **Component UI:** Radix UI, Lucide React (Icons), Sonner (Thông báo Toast).

### 2.2. Phía Backend (Máy chủ & API)
- **Framework:** Spring Boot 3.3.
- **Ngôn ngữ:** Java 17+.
- **Cơ sở dữ liệu:** MongoDB (NoSQL) thông qua Spring Data MongoDB.
- **Bảo mật:** Spring Security, JWT (JSON Web Token) kết hợp xác thực JWKS từ Clerk.
- **Thanh toán trực tuyến:** Tích hợp cổng thanh toán **VNPay** Sandbox.
- **Lưu trữ hình ảnh:** Cloudinary API.
- **Kiến trúc:** RESTful API, chia theo các tầng Controller, Service, Repository, DTO.
- **Build tool:** Maven (`mvnw`).

## 3. Các Chức Năng (Features) Đã Thực Hiện

### 3.1. Dành cho Khách Hàng (User)
1. **Xác thực:** Đăng nhập, đăng ký, quên mật khẩu, SSO (Google/Facebook) qua Clerk.
2. **Trang chủ & Sản phẩm:** Hiển thị Banner động, danh sách món ăn nổi bật (Best Sellers), combo khuyến mãi.
3. **Danh mục & Tìm kiếm:** Lọc sản phẩm theo danh mục (Combo, Gà rán, Burger, Đồ uống...), tìm kiếm bằng từ khoá, lọc theo khoảng giá, sắp xếp theo lượt bán.
4. **Chi tiết sản phẩm:** Xem thông tin món ăn, hình ảnh gallery, thêm vào giỏ hàng, chọn số lượng, lưu vào danh sách yêu thích (Wishlist). Đánh giá & Bình luận (Reviews) món ăn.
5. **Giỏ hàng & Khuyến mãi:** Quản lý giỏ hàng, nhập mã giảm giá (Promotions) để được giảm trực tiếp hoặc giảm % đơn hàng.
6. **Thanh toán (Checkout):** Hỗ trợ thanh toán khi nhận hàng (COD) hoặc thanh toán trực tuyến qua cổng VNPay.
7. **Quản lý tài khoản:** Xem lịch sử đơn hàng, trạng thái đơn hàng.
8. **Tin tức & Liên hệ:** Đọc bài viết/blog, gửi form liên hệ phản hồi cho cửa hàng.

### 3.2. Dành cho Quản Trị Viên (Admin)
1. **Dashboard:** Thống kê tổng số đơn hàng, doanh thu, sản phẩm, tin tức.
2. **Quản lý Sản phẩm & Danh mục (Products & Categories):** Thêm, sửa, xoá món ăn, danh mục. Hỗ trợ upload ảnh lên Cloudinary.
3. **Quản lý Đơn hàng (Orders):** Xem danh sách đơn hàng, cập nhật trạng thái đơn (Đang chuẩn bị, Đang giao, Đã giao, Đã huỷ).
4. **Quản lý Mã giảm giá (Promotions):** Tạo mã giảm giá theo %, theo số tiền cố định, giới hạn lượt dùng và giá trị đơn hàng tối thiểu.
5. **Quản lý Tin tức & Blog (News/Articles):** Viết bài, đăng tin tức sự kiện.
6. **Quản lý Liên hệ (Contacts):** Đọc tin nhắn từ khách hàng gửi qua form liên hệ và đánh dấu trạng thái đã xử lý.

## 4. Kết Quả Thực Hiện
- Đã hoàn thành một hệ thống Full-stack (Next.js + Spring Boot + MongoDB) chạy độc lập và giao tiếp qua API.
- Tích hợp thành công các giải pháp của bên thứ ba: Xác thực (Clerk), Lưu trữ ảnh (Cloudinary) và Thanh toán (VNPay).
- Hệ thống có khả năng mở rộng tốt nhờ sử dụng kiến trúc rời rạc và cơ sở dữ liệu NoSQL linh hoạt.
- Đã seed thành công bộ dữ liệu mẫu (món ăn, danh mục, mã giảm giá) thông qua `DataInitializer` của Spring Boot để có thể chạy thử nghiệm ngay lập tức.
- Chuyển đổi thành công toàn bộ giao diện từ ứng dụng Nông sản sang chủ đề Thức Ăn Nhanh (màu sắc, logo, hình ảnh).
