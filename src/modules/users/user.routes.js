import { Router } from "express";
import {
  UpdateInfoUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  recoverPassword,
  registerUser,
} from "./user.controllers.js";
import { authenticate, isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(registerUser).get(authenticate, isAdmin, getAllUsers);
router
  .route("/:id")
  .get(authenticate, getUserById)
  .patch(authenticate, UpdateInfoUser)
  .delete(authenticate, deleteUser);

router.route("/login").post(loginUser);
router.route("/recover").post(recoverPassword);

export default router;
