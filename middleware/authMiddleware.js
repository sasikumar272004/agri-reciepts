// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
// import Blacklist from "../models/blacklist"; // Only if using MongoDB, otherwise comment/remove

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Skipping Blacklist logic if not used
    // const blacklisted = await Blacklist.findOne({ token });
    // if (blacklisted) {
    //   return res.status(401).json({ message: "Token is blacklisted" });
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticateToken;
