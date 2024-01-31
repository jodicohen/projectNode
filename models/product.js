import mongoose, { isValidObjectId } from "mongoose";
import Joi from "joi";


const productSchema = mongoose.Schema({
    productName: String,
    description: String,
    ManufacturingDate: { type: Date, default: Date.now() },
    imageName: String,
    imagePath: String,

})

export const productModels = mongoose.model("products", productSchema);

export const productValidator = (_product) => {
    const productValidationSchema = Joi.object({
        
        productName: Joi.string().min(3).max(10).required(),
        description: Joi.string().min(0).max(10000).required(),
        ManufacturingDate: Joi.date(),
        imageName: Joi.string(),
        imagePath: Joi.string()

    })
    return productValidationSchema.validate(_product);
}

