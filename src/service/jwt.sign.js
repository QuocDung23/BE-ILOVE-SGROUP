import jwt from "jsonwebtoken";

function signJwt (user)
{
    const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.SECRET_KEY, 
        { expiresIn: "1d" }
    );
    return token;
}


export {signJwt}