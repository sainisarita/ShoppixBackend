const Order = require('../models/order');

// Route: POST /create-order
async function createOrder(req, res) {
    const { userId, items, totalPrice } = req.body;

    try {
        const order = new Order({
            user: userId,
            items,
            totalPrice,
            status: 'pending'
        });

        await order.save();
        res.json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Route: PUT /update-order-status/:orderId
async function updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const newStatus = req.body.newStatus;

    try {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status: newStatus } },
            { new: true }
        );
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Route: GET /get-user-orders/:userId
async function getUserOrders(req, res) {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ user: userId });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Route: GET /get-order/:orderId
async function getOrder(req, res) {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate('items.product');
        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrders,
    getOrder
};
