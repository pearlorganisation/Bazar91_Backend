import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import { mongoDbConnnection } from "./util/database.js";
import { authRoutes } from "./src/Routes/auth.js";
import morgan from "morgan";
import { errorHandler } from "./src/Middlewares/errorHandler.js";
import { brandRouter } from "./src/Routes/brand.js";
import { ProductRouter } from "./src/Routes/product.js";

configDotenv();
const app = express();
const PORT = process.env.PORT || 9002;

// ----------------------------CORS HANDLING -------------------------------------------------------------
app.use(
  cors(
    process.env.NODE_ENV === "development"
      ? {
          origin: [
            "http://localhost:7001",
            "http://localhost:7002",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "https://bazar91-frontend.vercel.app"
          ],
          credentials: true,
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "HEADER"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          exposedHeaders: ["*", "Authorization"],
        }
      : {
          origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175","https://bazar91-frontend.vercel.app"
            "*"],
        credentials:true,
        methods:["GET","PUT","POST","PATCH","DELETE","HEADER"],
        allowedHeaders:["Content-Type","Authorization","x-csrf-token"],
        exposedHeaders:["*","Authorization"]
    }:{
        origin:[
            "http://localhost:7001",
            "http://localhost:7002",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
          ],
          methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          allowedHeaders: ["Authorization", "Content-Type", "x-csrf-token"],
          exposedHeaders: ["*", "Authorization"],
        }
  )
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1", async (req, res) => {
  res.status(200).json({ status: true, message: "Welcome to Bazzar91" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/product", ProductRouter);

app.get("*", async (req, res) => {
  res.status(200).json({ message: "Path Not Defined !!" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  mongoDbConnnection();

  console.log(chalk.bold.bgGreenBright(`Server Is Running at ${PORT}`));
});
