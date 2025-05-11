const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config");
function usermiddleware(req , res , next)
{
    const token = req.headers.token;
    try{
    const decoded = jwt.verify(token , JWT_USER_SECRET);
    req.userId = decoded.userId;  
    next();
    }catch(err)
    {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
module.exports = usermiddleware;