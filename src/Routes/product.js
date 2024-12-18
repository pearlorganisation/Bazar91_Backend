import express from "express";
import { createProduct,deleteProduct,getAllProducts, getProductByBrand, getProductById} from "../Controllers/product.js";
import { upload } from "../Middlewares/multerConfig.js";

const router = express.Router();


router.route("")
.post(upload.fields([
    {name:"productBanner",maxCount:1},
    {name:"videoMetaData",maxCount:1},
    {name:"productImages",maxCount:6},
    {name:"attachments",maxCount:4},
    
]),createProduct)
.get(getAllProducts);

router.route("/:id")
.get(getProductById)
.delete(deleteProduct);

router.route("/brand/:brandId")
.get(getProductByBrand);



export const ProductRouter =  router;
