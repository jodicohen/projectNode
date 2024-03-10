import { productModels, productValidator } from "../models/product.js";
import mongoose from "mongoose";

export const getAllProduct = async (req, res) => {
  let txt = req.query.txt || undefined;
  let page = req.query.page || 1;
  let perPage = req.query.perPage || 30;

  try {
    let allProduct = await productModels
      .find({
        $or: [{ name: txt }],
      })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json(allProduct);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ type: "invalid operation", massage: "sorry cannot get product" });
  }
};

export const getProductById = async (req, res) => {
  let { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("קוד לא הגיוני");
    }
    let product = await productModels.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ type: "no id", message: "no product with such id" });
    return res.json(product);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ type: "invalid operation", message: "sorry cannot get product" });
  }
};

export const getProductByDescription = async (req, res) => {
  let page = req.query.page || 1;
  let perPage = req.query.perPage || 30;
  let { Description } = req.params;

  try {
    let product = await productModels
      .find({ Description: Description })
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (!product || product.length === 0) {
      return res.status(404).json({
        type: "not found",
        message: "No product with such description",
      });
    }

    return res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "invalid operation",
      message: "Sorry, cannot get product",
    });
  }
};

export const addProduct = async (req, res) => {
  let { productName, src, price, Description } = req.body;
  const result = productValidator(req.body);
  console.log(result);
  if (result.error)
    return res
      .status(400)
      .json({ type: "invalid data", message: result.error.details[0].message });
  try {
    let sameProduct = await productModels.findOne({ productName: productName });
    if (sameProduct)
      return res.status(409).json({
        type: "same details",
        message: "there is already same product",
      });
    let newProduct = new productModels({
      productName,
      src,
      price,
      Description,
    });
    await newProduct.save();
    return res.json(newProduct);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ type: "invalid operation", message: "sorry cannot add product" });
  }
};

export const deleteProduct = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new Error("קוד לא הגיוני");

  try {
    let product = await productModels.findById(id);
    if (!product)
      return res.status(404).json({
        type: "no product to delete",
        message: "no product with such id to delete",
      });
    product = await productModels.findByIdAndDelete(id);
    return res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "invalid operation",
      message: "sorry cannot delete product",
    });
  }
};

export const updateProduct = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res
      .status(400)
      .json({ type: "not valid id", message: "id not in right format" });
  try {
    let product = await productModels.findById(id);
    if (!product)
      return res.status(404).json({
        type: "product not found",
        message: "no product with such id",
      });
    let updated = await productModels.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "invalid operation",
      message: "sorry cannot update product",
    });
  }
};

//פונקציה של רובי בוט
export const addFieldToProducts = async (req, res) => {
  const { fieldName, fieldValue } = req.body;

  if (!fieldName || !fieldValue) {
    return res.status(400).json({
      type: "invalid request",
      message: "Field name and value are required in the request body",
    });
  }
  try {
    let products = await productModels.find();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ type: "products not found", message: "No products found" });
    }

    // Iterate over each product and add the specified field
    for (let product of products) {
      product[fieldName] = fieldValue; // Add the specified field to each product
    }

    // Save the updated products back to the database
    let updatedProducts = await Promise.all(
      products.map((product) => product.save())
    );

    return res.json(updatedProducts);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "invalid operation",
      message: "Sorry, cannot add field to products",
    });
  }
};

export const deleteFieldFromProducts = async (req, res) => {
  let num = req.params;
  try {
    const fieldName = req.body;

    if (!fieldName) {
      return res.status(400).json({
        type: "invalid request",
        message: "Field name is required in the request body",
      });
    }

    let products = await productModels.find();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ type: "products not found", message: "No products found" });
    }

    // Iterate over each product and delete the specified field
    for (let product of products) {
      delete product[fieldName]; // Delete the specified field from each product
      await product.save(); // Save the updated product without the specified field
    }

    return res.json({
      message: `Field '${fieldName}' deleted from all products`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "invalid operation",
      message: "Sorry, cannot delete field from products",
    });
  }
};
export const countProducts = async (req, res) => {
  let { Description } = req.params;
  try {
    let products = await productModels.find({ Description: Description });
    let cnt = products.length; // Get the number of objects in the collection
    res.json({ count: cnt });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error counting products" });
  }
};
