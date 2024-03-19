import express from "express";
import errorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

if(process.env.NODE_ENV!=="PRODUCTION"){
    // config
    dotenv.config({path:"backend/config/config.env"});
}

// Route Imports
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js";
import order from "./routes/orderRoute.js";
import payment from "./routes/paymentRoute.js";

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);


// static files
app.use(express.static(join(__dirname, "../frontend/build")));
app.get("*",(req,res) => {
    res.sendFile(resolve(__dirname, "../frontend/build/index.html"));
});


//Middleware for errors
app.use(errorMiddleware);


export default app;