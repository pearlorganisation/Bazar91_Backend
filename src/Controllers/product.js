import { VirtualType } from "mongoose";
import { asyncHandler } from "../../util/asyncHandler.js";
import { uploadFileToCloudinary } from "../../util/cloudinary/cloudinary.js";
import { ProductModel } from "../Models/product.js";
import chalk from "chalk";


// Controller for creating a new product
export const createProduct = asyncHandler(async (req, res) => {
    // let { productImages, productBanner, videoMetaData } = req.files;
    const { productTitle, price,brand, productDescription,productDetails, quantity,  optionalTags, discount } = req.body;
  


    const updatedFiles = {};
    const fileUploadPromises = Object.keys(req.files).map(async (element) => {
        // Upload each file and replace the file with its Cloudinary result
        updatedFiles[element] = await uploadFileToCloudinary(req.files[element]);
       
    });
    
    // Wait for all file uploads to complete before creating the product
    // req.files = updatedFiles;
    await Promise.all(fileUploadPromises);
    let { productImages, productBanner, videoMetaData ,attachments } = updatedFiles;

    // Create a new product
    const newProduct = await ProductModel.create({
        productTitle,
        brand,
        price,
        productDetails,
        productDescription,
        productImages:productImages||[],
        productBanner:productBanner[0]||'',
        quantity,
        videoMetaData:videoMetaData||[],
        optionalTags:optionalTags||[],
        attachments:attachments||[],
        discount
    });

    res.status(201).json({
        success: true,
        data: newProduct
    });
});


// Controller for getting all products
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await ProductModel.find().populate('brand',"title").select('brand productTitle banner productBanner createdAt').lean();
    

    res.status(200).json({
        success: true,
        data: products
    });
});

// Controller for getting a single product by ID
export const getProductById = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id).lean();

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// Controller for updating a product by ID
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// Controller for deleting a product by ID
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});
