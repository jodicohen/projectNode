import express from "express";
import { addProduct,getAllProduct,getProductById,deleteProduct,updateProduct } from "../controller/product.js";
import { auth, authAdmin } from "../middlewares/auth.js";
import { errorHandling } from "../middlewares/errorHandling.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.delete("/:id",authAdmin, deleteProduct);
router.post("/",authAdmin, addProduct);
router.put("/:id",authAdmin, updateProduct);

export default router;
