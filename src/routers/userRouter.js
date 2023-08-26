const express = require('express');
const { 
        getUsersForAdmin,
        getUserByIdForAdmin,
        deleteUserByIdForAdmin,
        getFillingStationOwnerForAdmin,
        getFillingStationOwnerByIdForAdmin,
        updateUserByIdForAdmin,
        userToFillingStationOwnerByIdForAdmin,
        userToUnFillingStationOwnerByIdForAdmin,
        userBannedByIdForAdmin,
        userUnbannedByIdForAdmin
       } = require('../controllers/userController');

const userRouter = express.Router();
const upload = require('../middlewares/uploadImage');


userRouter.get('/',
               getUsersForAdmin);

userRouter.get('/:id([a-fA-F0-9]{24})',         
               getUserByIdForAdmin);

userRouter.put('/:id([a-fA-F0-9]{24})',
               upload.single("image"),
               updateUserByIdForAdmin);

userRouter.delete('/:id([a-fA-F0-9]{24})',
               deleteUserByIdForAdmin);

userRouter.put('/ban-user/:id([a-fA-F0-9]{24})',
               userBannedByIdForAdmin);

userRouter.put('/unban-user/:id([a-fA-F0-9]{24})',
               userUnbannedByIdForAdmin);

userRouter.put('/make-fillingStationOwner/:id([a-fA-F0-9]{24})',
               userToFillingStationOwnerByIdForAdmin );

userRouter.put('/unmake-fillingStationOwner/:id([a-fA-F0-9]{24})',
               userToUnFillingStationOwnerByIdForAdmin );

userRouter.get('/findFillingStationOwner',
               getFillingStationOwnerForAdmin);

userRouter.get('/findFillingStationOwner/:id([a-fA-F0-9]{24})',
               getFillingStationOwnerByIdForAdmin);

module.exports=userRouter;