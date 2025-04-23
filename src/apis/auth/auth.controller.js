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
      const userLogin = req.body;
      const username = userLogin.name;
      const password = userLogin.password;
      console.log("username:", username);
      const responseSer = await AuthService.example(username, password);
      if (!example)
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      req.user = token;

      return res.status(200).json({
        success: true,
        // data: userLogin
        data: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
