const express = require('express');
const { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const categoryRouter=express.Router();


categoryRouter.post('/',
                    createCategory                  
                    );

categoryRouter.get('/',
                    getAllCategories
                    );

categoryRouter.get('/:slug',
                    getSingleCategory
                    );

categoryRouter.put('/:slug',
                    updateCategory
);

categoryRouter.delete('/:slug',
                    deleteCategory
);





module.exports=categoryRouter;