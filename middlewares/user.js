const jwt = require("jsonwebtoken");
function usermiddleware(req, res, next) {
  const token = req.headers.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
module.exports = usermiddleware;
