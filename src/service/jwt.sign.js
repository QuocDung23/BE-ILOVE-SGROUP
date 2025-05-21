import jwt from "jsonwebtoken";

function signJwt (user)
{
    const token = jwt.sign(
        { _id: user._id, name: user.name, role: user.role },
        process.env.SECRET_KEY, 
        { expiresIn: "1d" }
    );
    return token;
}

export {signJwt}