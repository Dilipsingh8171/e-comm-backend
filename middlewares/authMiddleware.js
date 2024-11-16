import { userModal } from "../modals/userModal.js";
import JWT from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;

  //validation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized user",
    });
  }

  const decodetoken = JWT.verify(token, process.env.JWT_SECRET);

  req.user = await userModal.findById(decodetoken._id);
  next();
};
