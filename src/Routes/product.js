import express from "express";
import { createProduct,getAllProducts} from "../Controllers/product.js";
import { upload } from "../Middlewares/multerConfig.js";

const router = express.Router();


router.route("")
.post(upload.fields([
    {name:"productBanner",maxCount:1},
    {name:"videoMetaData",maxCount:1},
    {name:"productImages",maxCount:6},
    
]),createProduct)
.get(getAllProducts);



export const ProductRouter =  router;
