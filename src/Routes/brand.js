import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from '../Controllers/brand.js';


const router = express.Router();

// Route to create a new brand
router.post('/', createBrand);

// Route to get all brands
router.get('/', getAllBrands);

// Route to get a specific brand by ID
router.get('/:id', getBrandById);

// Route to update a brand by ID
router.put('/:id', updateBrand);

// Route to delete a brand by ID
router.delete('/:id', deleteBrand);

export  const brandRouter = router;
