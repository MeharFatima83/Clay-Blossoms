require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
require ('./connection');
const productRouter = require('./router/productRouter');
const orderRouter = require('./router/orderRouter');
const userRouter = require('./router/userRouter');

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/users', userRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);