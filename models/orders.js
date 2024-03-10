import Joi from "joi";
import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  productToAdd: {
    productName: String,
    ManufacturingDate: { type: Date, default: Date.now() },
    src: String,
    price: { type: Number, min: -2147483648, max: 2147483647 },
    Description: String,
    amount: { type: Number, min: -2147483648, max: 2147483647 },
  },
  quantity: Number,
  summaryPerProduct: Number,
});

const userSchemaForOrder = mongoose.Schema({
  email: String,
  lastName: String,
  firstName: String,
  password: String,
  phone: String,
  city: String,
  adress: String,
});
export const orderSchema = mongoose.Schema({
  orderDate: { type: Date, default: Date.now() },
  getOrderDate: {
    type: Date,
    default: function () {
      return new Date(this.orderDate.getTime() + 14 * 24 * 60 * 60 * 1000); // Adding 14 days in milliseconds
    },
  },

  products: [ProductSchema],
  didOrderGoOutAlredy: Boolean,
  userId: String,
  userDetails: userSchemaForOrder,
});

export const orderModel = mongoose.model("orders", orderSchema);

export const orderValidator = (_order) => {
  const orderValidationSchema = Joi.object({
    userDetails: Joi.object(),
    orderDate: Joi.date(),
    getOrderDate: Joi.date(),
    orderAdress: Joi.string(),
    products: Joi.array(),
    didOrderGoOutAlredy: Joi.boolean(),

    userId: Joi.string(),
  });
  return orderValidationSchema.validate(_order);
};
