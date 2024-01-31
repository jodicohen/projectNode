import express from "express";
import { addOrder, deleteOrder,getAllOrders,setOff } from "../controller/orders.js";
import { auth,authAdmin } from "../middlewares/auth.js"

const router = express.Router();

router.post("/", auth, addOrder);
router.delete("/:id",auth,deleteOrder)
router.put('/:id',authAdmin,setOff)
router.get('/',auth,getAllOrders)

export default router;