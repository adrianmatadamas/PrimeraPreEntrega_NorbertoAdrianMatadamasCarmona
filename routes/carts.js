const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './data/carts.json';

// Helper function to read JSON file
const readCarts = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Helper function to write JSON file
const writeCarts = (carts) => {
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));
};

// POST create new cart
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// GET products in cart
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Cart not found');
    }
});

// POST add product to cart
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        writeCarts(carts);
        res.json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

module.exports = router;
