const express = require('express');
const upload = require('../middlewares/uploadImage');
const { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const productRouter = express.Router();





productRouter.post('/',
                upload.single("image"),
                createProduct);

productRouter.get('/',
                getAllProduct);

productRouter.get('/:slug',
                getSingleProduct);

productRouter.delete('/:slug',
                    deleteProduct);

productRouter.put('/:slug',
                upload.single("image"),
                updateProduct);


module.exports=productRouter;


