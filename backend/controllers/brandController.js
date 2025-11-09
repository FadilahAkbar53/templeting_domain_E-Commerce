// backend/controllers/brandController.js
const Brand = require("../models/Brand");
const Product = require("../models/Product");

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all brands (including inactive) - Admin only
// @route   GET /api/brands/admin
// @access  Private/Admin
const getAllBrandsAdmin = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });

    // Get product count for each brand
    const brandsWithCount = await Promise.all(
      brands.map(async (brand) => {
        const productCount = await Product.countDocuments({
          brand: brand.name,
        });
        return {
          ...brand.toObject(),
          productCount,
        };
      })
    );

    res.json(brandsWithCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
  try {
    const { name, logo, description } = req.body;

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ name: name.trim() });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = await Brand.create({
      name: name.trim(),
      logo: logo || "",
      description: description || "",
    });

    res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
  try {
    const { name, logo, description, isActive } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Check if new name conflicts with existing brand
    if (name && name.trim() !== brand.name) {
      const existingBrand = await Brand.findOne({ name: name.trim() });
      if (existingBrand) {
        return res.status(400).json({ message: "Brand name already exists" });
      }

      // Update all products with old brand name to new brand name
      await Product.updateMany({ brand: brand.name }, { brand: name.trim() });
    }

    brand.name = name ? name.trim() : brand.name;
    brand.logo = logo !== undefined ? logo : brand.logo;
    brand.description =
      description !== undefined ? description : brand.description;
    brand.isActive = isActive !== undefined ? isActive : brand.isActive;

    await brand.save();

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Check if brand is used in products
    const productCount = await Product.countDocuments({ brand: brand.name });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete brand. ${productCount} product(s) are using this brand.`,
      });
    }

    await Brand.findByIdAndDelete(req.params.id);

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllBrands,
  getAllBrandsAdmin,
  createBrand,
  updateBrand,
  deleteBrand,
};
