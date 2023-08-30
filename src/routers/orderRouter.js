const express = require('express');
const { placeOrder,
        deleteOrderById,
        getSingleOrder, 
        getOrders
        } = require('../controllers/orderController');
const orderRouter=express.Router();

orderRouter.get('/',
                getOrders
                );

orderRouter.get('/:id([a-fA-F0-9]{24})',
                getSingleOrder
                );

orderRouter.post('/place-order',
                placeOrder
                );
orderRouter.delete('/:id([a-fA-F0-9]{24})',
                deleteOrderById
                );

module.exports=orderRouter;