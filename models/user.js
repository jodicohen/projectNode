import Joi from "joi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    email: String,
    userName: String,
    password: String,
    role: {type:String,default:"USER"},
    startDate: { type: Date, default: Date.now() }
})

export const userModels = mongoose.model("users", userSchema);

export const generateToken = (_id, role, userName) => {

    let token = jwt.sign({ _id, userName, role }, process.env.SECRET_JWT, {
        expiresIn: "24h"
    });
    return token;
}

export const userValidator = (_user) => {
    const userValidationSchema = Joi.object({
        userName: Joi.string().min(3).max(10).required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string(),
        startDate: Joi.date()
    })
    return userValidationSchema.validate(_user);
}
