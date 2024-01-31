import express from "express";
import { addUser, getAllUsers, login } from "../controller/user.js";
import { auth, authAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authAdmin,getAllUsers);
router.post("/login", login);
router.post("/", addUser);

export default router;
