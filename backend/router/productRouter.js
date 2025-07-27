const productModel = require('../models/productModel');
const express = require('express');
const router = express.Router();

router.post('/add', (req, res) => {
    const productData = req.body;

    const newProduct = new productModel(productData);

    newProduct.save()
        .then((result) => {
            res.status(201).json({
                message: 'Product added successfully',
                product: result
            });
        })
        .catch((err) => {
            res.status(400).json({
                message: 'Error adding product',
                error: err.message
            });
        });
});

router.get('/getall', (req, res) => {
    productModel.find({})
        .then((products) => {
            res.status(200).json(products);
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error fetching products',
                error: err.message
            });
        });
});

router.delete('/delete/:id', (req, res) => {
    const productId = req.params.id;

    productModel.findByIdAndDelete(productId)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: 'Product deleted successfully',
                    product: result
                });
            } else {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error deleting product',
                error: err.message
            });
        });
});

router.put('/update/:id', (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;

    productModel.findByIdAndUpdate(productId, updatedData, { new: true })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: 'Product updated successfully',
                    product: result
                });
            } else {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
        }   )
        .catch((err) => {
            res.status(400).json({
                message: 'Error updating product',
                error: err.message
            });
        });
});

router.get('/get/:id', (req, res) => {
    const productId = req.params.id;

    productModel.findById(productId)
        .then((product) => {
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error fetching product',
                error: err.message
            });
        });
});

// Search products by name or title (autocomplete)
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim() === "") {
        return res.status(400).json({ message: "Query is required" });
    }
    try {
        // Case-insensitive partial match on 'name' or 'title' field
        const products = await productModel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { title: { $regex: q, $options: 'i' } }
            ]
        }).limit(10); // Limit results for performance
        console.log('Search query:', q, 'Results:', products.length);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error searching products", error: err.message });
    }
});

module.exports = router;