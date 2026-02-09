import express from 'express';
const app = express();
const PORT = 3001;

// In-memory user data
const users = {
    1: { id: 1, name: 'Alice', email: 'alice@example.com' }
};

// GET /users/:id - Retrieve user information
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users[userId];

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
