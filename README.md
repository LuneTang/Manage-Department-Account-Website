Hệ thống Quản lý Nhân sự & Phòng ban (Final Exam Project)
Đây là một dự án Full-Stack Web Application được xây dựng nhằm mục đích quản lý thông tin nhân viên và các phòng ban trong một tổ chức. Hệ thống cho phép phân quyền người dùng theo các vai trò khác nhau (Admin, Manager, Employee), mỗi vai trò có những chức năng và quyền hạn riêng biệt để đảm bảo tính bảo mật và logic nghiệp vụ.

✨ Tính năng chính
Hệ thống cung cấp đầy đủ các chức năng CRUD (Tạo, Đọc, Cập nhật, Xóa) cho các đối tượng chính và được phân quyền rõ ràng.

🔐 Xác thực & Phân quyền:
Đăng ký tài khoản (tài khoản mới mặc định có vai trò "Employee").
Đăng nhập với tài khoản và mật khẩu.
Tính năng Quên mật khẩu và Đặt lại mật khẩu.
Phân quyền truy cập chức năng dựa trên vai trò: Admin, Manager, và Employee.

🏢 Quản lý Phòng ban (Dành cho Admin/Manager):
Xem danh sách tất cả phòng ban theo dạng bảng có phân trang.
Tìm kiếm, lọc và sắp xếp phòng ban.
Thêm một phòng ban mới và chỉ định nhân viên vào phòng ban đó.
Cập nhật thông tin phòng ban (tên, loại, danh sách thành viên).
Xóa một hoặc nhiều phòng ban cùng lúc.

🧑‍💼 Quản lý Tài khoản (Dành cho Admin/Manager):
Xem danh sách tất cả tài khoản người dùng với phân trang.
Tìm kiếm, lọc và sắp xếp tài khoản.
Tạo tài khoản mới cho nhân viên.
Cập nhật vai trò và phòng ban cho một tài khoản.
Xóa một hoặc nhiều tài khoản.

👤 Hồ sơ cá nhân:
Người dùng có thể xem lại thông tin cá nhân của mình.
Người dùng có thể tự thay đổi mật khẩu.

🛠️ Công nghệ sử dụng
Backend: Spring Boot / Java
Frontend: HTML, CSS, Vanilla JavaScript
Database: MySQL

🚀 Hướng dẫn cài đặt và chạy dự án
Yêu cầu
MySQL Workbench (hoặc một công cụ quản lý MySQL khác).
Spring Tool Suite (hoặc IntelliJ, Eclipse có hỗ trợ Spring).
Visual Studio Code với extension Live Server.

Các bước thực hiện
Khởi động Cơ sở dữ liệu
Mở MySQL Workbench.
Chạy file FinalTestingSystem.sql để tạo cơ sở dữ liệu và dữ liệu mẫu cần thiết.

Khởi động Backend
Mở project backend bằng "Spring Tool Suite".
Chạy project để khởi động server.

Khởi động Frontend
Mở thư mục frontend bằng "VSCode".
Vào thư mục pages, chuột phải vào file login-page.html và chọn "Open with Live Server".

🔑 Tài khoản Demo
Bạn có thể sử dụng các tài khoản sau để kiểm tra các chức năng của hệ thống:

   * Admin
     Username: `johnsmith`
     Password: `JohnSmith2024!@#`

   * Manager
     Username: `alicejones`
     Password: `AliceJones2024#A!`

   * Employee
     Username: `bobjames`
     Password: `BobJames2024!xyz`

Lưu ý:
Vai trò 
Admin và Manager có toàn quyền truy cập các tính năng quản lý.
Bất kỳ tài khoản nào được đăng ký mới sẽ tự động có vai trò là Employee và có quyền truy cập hạn chế.

🧪 Hướng dẫn sử dụng Swagger
Giao diện Swagger của dự án này đã được bảo mật và yêu cầu bạn phải đăng nhập để sử dụng.

Bước 1: Truy cập Swagger UI
Sau khi chạy Database và Backend bang Spring tool Suite, tiến hành truy cập đường dẫn: http://localhost:8080/swagger-ui/index.html

Bước 2: Lấy Token
Sử dụng một trong các tài khoản demo ở trên để đăng nhập
Sau khi đăng nhập thành công sẽ trả về thông tin user có cả token, copy token đó.

Bước 3: Mở khóa Authorize
Trên giao diện Swagger, nhấn vào nút Authorize ở góc trên bên phải.

Bước 4: Dán Token
Một cửa sổ sẽ hiện ra. Trong ô Value, dán token bạn đã copy theo định dạng sau:
Bearer <token_của_bạn>
Ví dụ: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huc21pdG...
Nhấn Authorize và đóng cửa sổ. Giờ bạn đã có thể sử dụng tất cả các API.

*Các API ở auth-controller không cần token nên có thể dùng dù không login

