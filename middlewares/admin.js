const jwt = require("jsonwebtoken");

function adminmiddleware(req , res , next)
{
    const token = req.headers.token;
    try{
    const decoded = jwt.verify(token , process.env.JWT_ADMIN_SECRET);
    req.adminId = decoded.adminId;  
    next();
    }catch(err)
    {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
module.exports = adminmiddleware;