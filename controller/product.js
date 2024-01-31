import { productModels  ,productValidator} from "../models/product.js";
import mongoose from "mongoose";

export const getAllProduct = async (req, res) => {
    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;

    try {
        let allProduct = await productModels.find({
            $or:
                [{ name: txt }]
        }).skip((page - 1) * perPage).limit(perPage);

        res.json(allProduct)

    }
    catch (err) {
        req.status(400).json({ type: "invalid operation", massage: "sorry cannot get product" })
    }
}

export const getProductById = async (req, res) => {
    let { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            res.status(400);
            throw new Error('קוד לא הגיוני')
        }
        let product = await productModels.findById(id);
        if (!product)
            return res.status(404).json({ type: "no id", message: "no product with such id" })
        return res.json(product)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot get product" })
    }

}

export const addProduct = async (req, res) => {
    let { productName, description, ManufacturingDate, imageName, imagePath } = req.body;
    const result =  productValidator(req.body);
    console.log(result)
    if (result.error)
        return res.status(400).json({ type: "invalid data", message: result.error.details[0].message })
    try {
        let sameProduct = await productModels.findOne({ productName: productName });
        if (sameProduct)
            return res.status(409).json({ type: "same details", message: "there is already same product" })
        let newProduct = new productModels({ productName, description, ManufacturingDate, imageName, imagePath });
        await newProduct.save();
        return res.json(newProduct)
    } catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot add product" })
    }
}

export const deleteProduct = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        throw new Error("קוד לא הגיוני");

    try {
        let product = await productModels.findById(id);
        if (!product)
            return res.status(404).json({ type: "no product to delete", message: "no product with such id to delete" })
        product = await productModels.findByIdAndDelete(id)
        return res.json(product)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot delete product" })

    }
}

export const updateProduct = async (req,res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "not valid id", message: "id not in right format" })
    try {
        let product = await productModels.findById(id);
        if (!product)
            return res.status(404).json({ type: "product not found", message: "no product with such id" })
        let updated = await productModels.findByIdAndUpdate(id, req.body, { new: true })

        return res.json(updated);

    }

    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot update product" })
    }

}