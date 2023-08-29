const express = require('express');
const { 
        getUsersForAdmin,
        getUserByIdForAdmin,
        deleteUserByIdForAdmin,
        updateUserByIdForAdmin,
        userBannedByIdForAdmin,
        userUnbannedByIdForAdmin,
        userToOwnerShipByIdForAdmin,
        userToUnOwnerShipByIdForAdmin,
        processRegister,
        activateAccount,
        updatePassword,
        forgetPassword,
        resetPassword
       } = require('../controllers/userController');

const userRouter = express.Router();
const upload = require('../middlewares/uploadImage');



userRouter.post('/process-register',
                  upload.single("image"), 
                  processRegister);

userRouter.post('/verify',
                  activateAccount);


userRouter.get('/',
               getUsersForAdmin);

userRouter.get('/:id([a-fA-F0-9]{24})',         
               getUserByIdForAdmin);

userRouter.put('/update/:id([a-fA-F0-9]{24})',
               upload.single("image"),
               updateUserByIdForAdmin);

userRouter.delete('/:id([a-fA-F0-9]{24})',
               deleteUserByIdForAdmin);

userRouter.put('/ban-user/:id([a-fA-F0-9]{24})',
               userBannedByIdForAdmin);

userRouter.put('/unban-user/:id([a-fA-F0-9]{24})',
               userUnbannedByIdForAdmin);

userRouter.put('/make-owner/:id([a-fA-F0-9]{24})',
               userToOwnerShipByIdForAdmin);

userRouter.put('/unmake-owner/:id([a-fA-F0-9]{24})',
               userToUnOwnerShipByIdForAdmin);

userRouter.put('/update-password/:id([a-fA-F0-9]{24})',
               updatePassword);

userRouter.post('/forget-password',
               forgetPassword);

userRouter.put('/reset-password',
               resetPassword);





module.exports=userRouter;