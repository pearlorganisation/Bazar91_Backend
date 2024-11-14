import { asyncHandler } from "../../util/asyncHandlerr.js";
import { BrandModel } from "../Models/brand.js";

// Controller for creating a brand
export const createBrand = asyncHandler( async (req, res) => {
  
    const brand = await BrandModel.create(req.body);
    res.status(201).json({
      success: true,
      data: brand,
    });
  
  
});

// Controller for getting all brands
export const getAllBrands = asyncHandler(async (req, res) => {
  
    const brands = await BrandModel.find();
    res.status(200).json({
      success: true,
      data: brands,
    });
  
  
});

// Controller for getting a single brand by ID
export const getBrandById = asyncHandler(async (req, res) => {
  
    const brand = await BrandModel.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    res.status(200).json({
      success: true,
      data: brand,
    });
  
});

// Controller for updating a brand by ID
export const updateBrand = asyncHandler(async (req, res) => {

    const brand = await BrandModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    res.status(200).json({
      success: true,
      data: brand,
    });

});

// Controller for deleting a brand by ID
export const deleteBrand = asyncHandler(async (req, res) => {
  
    const brand = await BrandModel.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
 
});
