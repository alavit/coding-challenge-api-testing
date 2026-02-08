const express = require('express');
const app = express();
const PORT = 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory orders data
let orders = [
    { orderId: 1, userId: 1, amount: 49.99 }
];
let nextOrderId = 2;

// GET /orders?userId=:id - Retrieve active orders for a user
app.get('/orders', (req, res) => {
    const userId = parseInt(req.query.userId, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'userId query parameter is required' });
    }

    const userOrders = orders.filter(order => order.userId === userId);
    res.status(200).json(userOrders);
});

// POST /orders - Create a new order
app.post('/orders', (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
        return res.status(400).json({ error: 'userId and amount are required' });
    }

    const newOrder = {
        orderId: nextOrderId++,
        userId: parseInt(userId, 10),
        amount: parseFloat(amount)
    };

    orders.push(newOrder);
    res.status(200).json(newOrder);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
