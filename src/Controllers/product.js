import { asyncHandler } from "../../util/asynchandler.js";
import { uploadFileToCloudinary } from "../../util/cloudinary/cloudinary.js";
import { ProductModel } from "../Models/product.js";
import chalk from "chalk";


// Controller for creating a new product
export const createProduct = asyncHandler(async (req, res) => {
    let { productImages, productBanner, videoMetaData } = req.files;
    const { productTitle, price, productDescription, quantity, wishListed, optionalTags, discount } = req.body;
  
    // Handle file uploads for all fields in req.files
    // if(productImages)
    productImages = await uploadFileToCloudinary(productImages);
    // productBanner = await uploadFileToCloudinary(productBanner);
    // videoMetaData = await uploadFileToCloudinary(videoMetaData);

    // const updatedFiles = {};
    // const fileUploadPromises = Object.keys(req.files).map(async (element) => {
    //     // Upload each file and replace the file with its Cloudinary result
    //     updatedFiles[element] = await uploadFileToCloudinary([element]);
    // });

    // Wait for all file uploads to complete before creating the product
    // await Promise.all(fileUploadPromises);

    // Create a new product
    const newProduct = await ProductModel.create({
        productTitle,
        price,
        productDescription,
        productImages,
        productBanner,
        quantity,
        // videoMetaData,
        // optionalTags,
        discount
    });

    res.status(201).json({
        success: true,
        data: newProduct
    });
});


// Controller for getting all products
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await ProductModel.find();

    res.status(200).json({
        success: true,
        data: products
    });
});

// Controller for getting a single product by ID
export const getProductById = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id);

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
