import AuthService from "./auth.service.js";

class AuthController {
    async register(req, res) {
        try {
          const { name, password, email } = req.body;
          if (!name || !password || !email) {
            console.log();
            
            return res.status(400).json({ message: "Thiếu tên, mail hoặc mật khẩu" });
          }
      
          const user = await AuthService.register(name, password, email);
          return res.status(201).json({
            success: true,
            message: "Đăng kí thành công",
            data: user
          });
        } catch (err) {
          console.log(err);  
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }
      }
      async example(req, res) {
        try {
          const { name, password } = req.body;
          console.log(name, password);
          
      
          if (!name || !password) {
            return res.status(400).json({
              success: false,
              message: "Thiếu tên hoặc mật khẩu",
            });
          }
      
          const { user, token } = await AuthService.example(name, password);
      
          if (!user || !token) {
            return res.status(401).json({
              success: false,
              message: "Tên đăng nhập hoặc mật khẩu không đúng",
            });
          }
      
          req.user = user; // Gán user cho req nếu cần dùng ở middleware tiếp theo
      
          return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
              user,
              token,
            },
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ: " + error.message,
          });
        }
      }
      
}

export default new AuthController();
