import express from "express";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js"
import orderRouter from "./routes/order.js"
import { connectToDB } from "./db/conectToDB.js"
import { config } from "dotenv";
import cors from "cors";
import { errorHandling } from "./middlewares/errorHandling.js";



const printDate = (req, res, next) => {
    console.log("a new request in", Date.now())
    next()
}

const addData = (req, res, next) => {
    req.xxx = { name: "diza" };
    next();

}
const app = express();

connectToDB();
app.use(cors())
app.use(express.json());
app.use(errorHandling);

config();

// app.get("/api/all/:name")
app.use("api/all", express.static("files"))
app.use("/api/order",orderRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

app.use(errorHandling)

let port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})

