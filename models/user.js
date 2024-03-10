import Joi from "joi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  email: String,
  userLastName: String,
  userFirstName: String,
  password: String,
  phone: String,
  role: { type: String, default: "USER" },
  startDate: { type: Date, default: Date.now() },
  adress: String,
  city: String,
});

export const userModels = mongoose.model("users", userSchema);

export const generateToken = (_id, role, userName) => {
  let token = jwt.sign({ _id, userName, role }, process.env.SECRET_JWT, {
    expiresIn: "100000h",
  });
  return token;
};

export const userValidator = (_user) => {
  const userValidationSchema = Joi.object({
    userLastName: Joi.string().min(2).max(10).required(),
    userFirstName: Joi.string().min(2).max(10),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string(),
    startDate: Joi.date(),
    adress: Joi.string(),
    city:Joi.string()
  });
  return userValidationSchema.validate(_user);
};
