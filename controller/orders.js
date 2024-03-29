import mongoose from "mongoose";
import { orderModel,orderValidator } from "../models/orders.js"


export const getAllOrders = async (req, res, next) => {


    try {
  
        let allOrders = await orderModel.find({userId:req.user._id} )
        return res.json(allOrders)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get orders" })
    }
}



export const deleteOrder = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })
    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: "no order to delete", message: "no order with such id to delete" })
        order = await orderModel.findById(id);
        if (req.user.role != "ADMIN" && order.userId != req.user._id && order.didOrderGoOutAlredy)
            res.status(403).json({ type: "you are not allowed", message: "you are not allowed to delete a product" })
        order = await orderModel.findByIdAndDelete(id);
        return res.json(order)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get order" })
    }

}

export const addOrder = async (req, res) => {
    let {products,orderDate,getOrderDate,userDetails} = req.body;
    const result = await orderValidator(req.body);
    console.log(result)
    if (result.error)
        return res.status(400).json({ type: " invalid data", message: result.error.details[0].message })

    try {
        let newOrder = new orderModel({ orderDate, getOrderDate, products, userId:req.user._id,userDetails});
        await newOrder.save();
        return res.json(newOrder)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot add order" })
    }

}


export const setOff = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId()) {
        res.status(400);
        throw new Error('not valide id')
    }
    try {
        let order = await orderModel.findById(id)
        if (!order)
            return res.status(404).json({ type: "no id", message: "no order with such id" })
        let updated = await orderModel.findByIdAndUpdate({ didOrderGoOutAlredy: true })
        return res.json(updated);


    } catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get order" })
    }
}