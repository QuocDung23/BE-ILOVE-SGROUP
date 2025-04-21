import AuthService from './auth.service.js';

class AuthController {
    async example(req,res){
        try {
            const userLogin = req.body;
            const username = userLogin.name;
            const password = userLogin.password;
            console.log("username:", username);
            const responseSer = await AuthService.example(username, password);
            if (!example) 
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            req.user = token;
            
            return res.status(200).json({
                success: true,
                // data: userLogin
                data: token
            });
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new AuthController();