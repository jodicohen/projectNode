import express from "express";
import { addProduct,getAllProduct,getProductById,deleteProduct,updateProduct, countProducts,addFieldToProducts,getProductByDescription} from "../controller/product.js";
import { auth, authAdmin } from "../middlewares/auth.js";
import { errorHandling } from "../middlewares/errorHandling.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.get("/Description/:Description", getProductByDescription);
router.delete("/:id",authAdmin, deleteProduct);
router.post("/",authAdmin, addProduct);
router.put("/:id",authAdmin, updateProduct);
router.put("/",authAdmin,addFieldToProducts);
router.get("/count/:Description",countProducts );


export default router;
