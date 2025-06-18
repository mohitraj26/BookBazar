import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {

    let token = req.cookies?.token;

    if (!token) {
      console.log("No token");
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    const decoded =  jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    console.log("Auth middleware failure");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};