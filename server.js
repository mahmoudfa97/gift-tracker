// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

let gifts = []; // In-memory storage for gifts

app.use(cors());
app.use(bodyParser.json());

// Proxy for Next.js application
app.use('/next', createProxyMiddleware({
    target: 'http://localhost:3000', // Your Next.js app
    changeOrigin: true,
    pathRewrite: { '^/next': '' }, // Remove `/next` from the path
}));

// Get all gifts
app.get('/api/gifts', (req, res) => {
    res.json(gifts);
});

// Add or update a gift
app.post('/api/gifts', (req, res) => {
    const { recipient, visits, price } = req.body;

    if (!recipient || !visits || !price) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingGiftIndex = gifts.findIndex(gift => gift.recipient.toLowerCase() === recipient.toLowerCase());

    if (existingGiftIndex !== -1) {
        // Update existing gift
        gifts[existingGiftIndex].visits = (parseInt(gifts[existingGiftIndex].visits) + parseInt(visits)).toString();
        gifts[existingGiftIndex].price = (parseFloat(gifts[existingGiftIndex].price) + parseFloat(price)).toFixed(2);
    } else {
        // Add new gift
        const newGift = { id: Date.now(), recipient, visits, price };
        gifts.push(newGift);
    }

    res.json(gifts);
});

// Remove a gift
app.delete('/api/gifts/:id', (req, res) => {
    gifts = gifts.filter(gift => gift.id !== Number(req.params.id));
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
