import mongoose, { isValidObjectId } from "mongoose";
import Joi from "joi";



const productSchema = mongoose.Schema({
    productName: String,
    ManufacturingDate: { type: Date, default: Date.now() },
    src:String,
    price:{ type: Number, min: -2147483648, max: 2147483647 },
    Description:String,
    amount:{ type: Number, min: -2147483648, max: 2147483647 }
})

export const productModels = mongoose.model("products", productSchema);

export const productValidator = (_product) => {
    const productValidationSchema = Joi.object({
        
        productName: Joi.string().min(3).max(100).required(),
        ManufacturingDate: Joi.date(),
        src:Joi.string(),
        price:Joi.number(),
        Description:Joi.string(),
        amount:Joi.number()


    })
    return productValidationSchema.validate(_product);
}

