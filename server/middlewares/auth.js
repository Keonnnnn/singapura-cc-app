const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ error: "Token missing" });
    }

    const payload = verify(accessToken, process.env.APP_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "Staff") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: Admins only" });
};

const isAuthorized = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient privileges" });
    }
    next();
  };
};

module.exports = { validateToken, isAdmin, isAuthorized };
