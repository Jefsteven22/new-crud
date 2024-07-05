import jwt from "jsonwebtoken";
import "dotenv/config";

//* Token authenticate
export const authenticate = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error("No authorization header");
    }

    const token = authorization.split(" ")[1];

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: "HS512",
    });

    req.user = verifyToken;
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

//* Admin user authenticate
export const isAdmin = (req, res, next) => {
  try {
    const handleRole = req.user.roleId;
    console.log(handleRole);
    if (handleRole !== 2) {
      throw new Error("The user is not Admin");
    }
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
