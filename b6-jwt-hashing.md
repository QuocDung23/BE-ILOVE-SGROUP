
JWT:
Struct File:
src:
    - API: 
            -user:
                -router: // các method
                -controller: //thông tin
                -service:// hashing
    -database:
            -repository: //logic + function repository
            - Chứa logic kết nối cơ sở dữ liệu.
    -Middleware:
    -model: 
            - Chưa các schema hoặc model tương ứng với dữ liệu trong cơ sở dữ liệu.
    - repo:
            - Chứa các thao tác CRUD truy vẫn dữ liệu 
    -service:
            - Chứa các dịch vụ xử lý logic chính không thuộc controller, ví dụ xử lý nghiệp vụ hoặc các dịch vụ bên ngoài.
 sart

Forgot Password:

API 1:
        Client


Phân quyền RBAC: kiểm soát truy cập dựa trên vai trò 
Phân quyền ACL: phân quyền trực tiếp của role

restFul API: cung cấp giao diện thống nhất, không phải có trạng thái
