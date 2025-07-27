
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_zIcp2q8Ubf993V',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'gqgP9s5d4kP2b3V3W4X5Y6z7'
});

// Create Order (handles both COD and Online)
router.post('/create', async (req, res) => {
    try {
        const { items, customerDetails, paymentMethod, subtotal, shipping, total } = req.body;

        if (paymentMethod === 'online') {
            // Create Razorpay order
            const options = {
                amount: total * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: `receipt_order_${new Date().getTime()}`
            };
            const razorpayOrder = await razorpay.orders.create(options);

            // Save order to DB with pending payment status
            const order = new Order({
                items,
                customerDetails,
                paymentMethod,
                subtotal,
                shipping,
                total,
                status: 'pending',
                paymentStatus: 'pending',
                isPaid: false,
                paymentDetails: {
                    razorpay_order_id: razorpayOrder.id,
                }
            });
            await order.save();
            console.log('Order created (online):', order);
            res.status(201).json({ 
                message: 'Order created, proceed to payment', 
                order, 
                razorpayOrder 
            });

        } else if (paymentMethod === 'cod') {
            // Save COD order to DB
            const order = new Order({
                items,
                customerDetails,
                paymentMethod,
                subtotal,
                shipping,
                total,
                status: 'Processing',
                isPaid: false
            });
            await order.save();
            console.log('Order created (COD):', order);
            res.status(201).json({ message: 'Order placed successfully (COD)', order });
        } else {
            res.status(400).json({ message: 'Invalid payment method' });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'gqgP9s5d4kP2b3V3W4X5Y6z7');
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest === razorpay_signature) {
            const order = await Order.findOne({ 'paymentDetails.razorpay_order_id': razorpay_order_id });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            
            order.isPaid = true;
            order.status = 'processing';
            order.paymentStatus = 'paid';
            order.paymentDetails.razorpay_payment_id = razorpay_payment_id;
            order.paymentDetails.razorpay_signature = razorpay_signature;
            await order.save();

            res.status(200).json({ message: 'Payment verified successfully', orderId: order._id });
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
});

// Get all orders for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ 'customerDetails.userId': userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to fetch user orders', error });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order', error });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error });
    }
});

// Cancel order (user)
router.put('/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }
        order.status = 'cancelled';
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Failed to cancel order', error: error.message });
    }
});

// Refund order (admin or system)
router.put('/:id/refund', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (
      order.paymentMethod !== 'online' ||
      !order.isPaid ||
      order.status !== 'cancelled' ||
      order.refundStatus === 'refunded'
    ) {
      return res.status(400).json({ message: 'Refund not allowed for this order' });
    }

    // Call Razorpay refund API
    const paymentId = order.paymentDetails.razorpay_payment_id;
    if (!paymentId) {
      return res.status(400).json({ message: 'No payment ID found for refund' });
    }

    order.refundStatus = 'processing';
    await order.save();

    try {
      const refund = await razorpay.payments.refund(paymentId, {
        amount: order.total * 100, // refund full amount
        speed: 'optimum'
      });

      order.refundStatus = 'refunded';
      order.refundDetails = {
        refundId: refund.id,
        refundAmount: refund.amount / 100,
        refundDate: new Date(),
        refundReason: req.body.refundReason || 'Order cancelled',
        refundError: ''
      };
      await order.save();

      res.status(200).json({ message: 'Refund processed successfully', order });
    } catch (refundError) {
      order.refundStatus = 'failed';
      order.refundDetails = {
        refundId: '',
        refundAmount: 0,
        refundDate: new Date(),
        refundReason: req.body.refundReason || 'Order cancelled',
        refundError: refundError.message
      };
      await order.save();
      res.status(500).json({ message: 'Refund failed', error: refundError.message });
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ message: 'Failed to process refund', error: error.message });
  }
});

// User requests refund with UPI/bank details
router.put('/:id/request-refund', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      order.paymentMethod !== 'online' ||
      !order.isPaid ||
      order.status !== 'cancelled' ||
      order.refundStatus === 'refunded'
    ) {
      return res.status(400).json({ message: 'Refund not allowed for this order' });
    }

    const { upiId, bankDetails } = req.body;
    if (!upiId && !bankDetails) {
      return res.status(400).json({ message: 'Please provide UPI ID or bank details' });
    }

    order.refundStatus = 'requested';
    order.refundDetails = {
      ...order.refundDetails,
      upiId,
      bankDetails,
      refundReason: 'User requested refund',
      refundDate: new Date(),
    };
    await order.save();

    res.status(200).json({ message: 'Refund request submitted', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to request refund', error: error.message });
  }
});

module.exports = router; 