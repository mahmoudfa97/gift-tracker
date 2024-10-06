// netlify/functions/gifts.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

const app = express();
let gifts = [];

const corsOptions = {
    origin: 'https://gifttracker.netlify.app', // Your Netlify domain
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

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

// Delete a gift
app.delete('/api/gifts/:id', (req, res) => {
    gifts = gifts.filter(gift => gift.id !== Number(req.params.id));
    res.sendStatus(204);
});

module.exports.handler = serverless(app);
