const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './data/products.json';

// Helper function to read JSON file
const readProducts = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Helper function to write JSON file
const writeProducts = (products) => {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

// GET all products
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// GET product by ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// POST new product
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        ...req.body,
        status: true
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// PUT update product
router.put('/:pid', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index !== -1) {
        const updatedProduct = {
            ...products[index],
            ...req.body,
            id: products[index].id // Ensure ID remains the same
        };
        products[index] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).send('Product not found');
    }
});

// DELETE product
router.delete('/:pid', (req, res) => {
    let products = readProducts();
    products = products.filter(p => p.id !== req.params.pid);
    writeProducts(products);
    res.status(204).send();
});

module.exports = router;
