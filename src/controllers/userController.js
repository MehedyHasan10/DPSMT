const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('./responseController');


//const { createJsonWebToken } = require('../helper/jsonWebToken');
//const { jwtActivationKey, clientURL, jwtRestPasswordKey } = require('../secret');
//const emailwithNodeMailer = require('../helper/email');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');




const getUsersForAdmin = async (req,res,next) =>{

    try{
         
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1; 
    const limit = Number(req.query.limit) || 5; 


    const searchRegExp = new RegExp('.*'+ search + '.*','i') ; 
    
    const filter = {
        isAdmin: {$ne: true},
        $or:[  
            {name:{$regex:searchRegExp}},
            {email:{$regex:searchRegExp}},
            {phone:{$regex:searchRegExp}},  
            {nidNo:{$regex:searchRegExp}},       
        ],
    };


    const options = {
        password:0
    };


    const users = await User.find(filter,options)                                                         
    .limit(limit)
    .skip((page-1) * limit);
    const count = await User.find(filter).countDocuments();

    
    if (users.length === 0) {
      throw createError(404, 'Users Not found');
    }
   
    return successResponse(res,{
        statusCode:200,
        message:'Users Returned...........',
        payload:{
            users,
            pagination: {
                 totalPages: Math.ceil(count / limit),
                 currentPage:page,
                 previousPage: page - 1> 0 ? page-1 : null,
                 nextPAge: page + 1 <= Math.ceil(count / limit) ? page + 1 : null ,
            },
        },
       
    });

} catch (error){
    next(error);
}
};

const getUserByIdForAdmin = async (req,res,next) =>{

    try{
        const id = req.params.id;
        const options = {password: 0}
      
        const user =await User.findById(id,options);  

        if (!user) {
            throw createError(404, 'user not found');
          }

        return successResponse (res,{
            statusCode: 200,
            message:'user return sucessfully',
            payload: {user},
        });
              
} catch (error){
    next(error);
}
};

const deleteUserByIdForAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await User.findById(id, options); 

        if (!user) {
            throw createError(404, 'user not found');
          }

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });
        return successResponse (res,{
            statusCode: 200,
            message:'user delete sucessfully',
         
        });
              
} catch (error){
    next(error);
}
};

const updateUserByIdForAdmin = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const options = { password: 0 };
      const user = await User.findById(userId, options);

      if (!user) {
        throw createError(404, 'user not found');
      } 

      const UpdateOptions = { new: true, context: 'query' }; //runValidation: true,
      let updates = {};
  
      for (let key in req.body) {
        if (['name', 'password', 'address', 'phone','centerName','nidNo'].includes(key)) {
          updates[key] = req.body[key];
        } else if(['email'].includes(key)){
          throw createError(400,'email can not be update');
        }
      }
  
      const image = req.file;
      if (image) {
        if (image.size > 1024 * 1024 * 5) {
          throw new Error('File is too large, it must be less than 5 MB');
        }
        updates.image = image.buffer.toString('base64');
      }
  
      const updateUser = await User.findByIdAndUpdate(userId, updates, UpdateOptions)
      .select("-password");   // .select("-password") use for deselected
      if (!updateUser) {
        throw new Error('User with this ID does not exist');
      }
  
      return successResponse(res, {
        statusCode: 200,
        message: 'User updated successfully',
        payload: updateUser,
      });
    } catch (error) { 
      console.error(error);
    
      next(error);
    }
};

const userBannedByIdForAdmin = async (req, res, next) => {
    try {
      const userId = req.params.id;
      await User.findById(userId);
      const updates = {isBanned: true};
      const UpdateOptions = { new: true, context: 'query' };  // runValidation: true,
     
  
      const updateUser = await User.findByIdAndUpdate(userId,updates, UpdateOptions).select("-password");   // .select("-password") use for deselected
      if (!updateUser) {
        throw new Error('User is not banned successfuly');
      }
  
      return successResponse(res, {
        statusCode: 200,
        message: 'User is banned successfuly',
      
      });
    } catch (error) {
      next(error);
    }
};

const userUnbannedByIdForAdmin = async (req, res, next) => {
    try {
      const userId = req.params.id;
      await User.findById(userId);
      const updates = {isBanned: false};
      const UpdateOptions = { new: true, context: 'query' };  // runValidation: true,
     
  
      const updateUser = await User.findByIdAndUpdate(userId,updates, UpdateOptions).select("-password");   // .select("-password") use for deselected
      if (!updateUser) {
        throw new Error('User is not unbanned successfuly');
      }
  
      return successResponse(res, {
        statusCode: 200,
        message: 'User is unbanned successfuly',
      
      });
    } catch (error) {
      next(error);
    }
};

const userToFillingStationOwnerByIdForAdmin = async (req, res, next) => {
    try {
      const userId = req.params.id;
      await User.findById(userId);
      const updates = {isFellingStationOwner: true};
      const UpdateOptions = { new: true, context: 'query' };  // runValidation: true,
     
  
      const updateUser = await User.findByIdAndUpdate(userId,updates, UpdateOptions).select("-password");   // .select("-password") use for deselected
      if (!updateUser) {
        throw new Error('User is not make Filling Station Owner successfuly');
      }
  
      return successResponse(res, {
        statusCode: 200,
        message: 'User is make Filling Station Owner successfuly',
      
      });
    } catch (error) {
      next(error);
    }
};

const userToUnFillingStationOwnerByIdForAdmin = async (req, res, next) => {
    try {
      const userId = req.params.id;
      await User.findById(userId);
      const updates = {isFellingStationOwner: false};
      const UpdateOptions = { new: true, context: 'query' };  // runValidation: true,
     
  
      const updateUser = await User.findByIdAndUpdate(userId,updates, UpdateOptions).select("-password");   // .select("-password") use for deselected
      if (!updateUser) {
        throw new Error('User is not unmake Filling Station Owner successfuly');
      }
  
      return successResponse(res, {
        statusCode: 200,
        message: 'User is unmake Filling Station Owner successfuly',
      
      });
    } catch (error) {
      next(error);
    }
};

const getFillingStationOwnerForAdmin = async (req,res,next) =>{

    try{
         
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1; 
    const limit = Number(req.query.limit) || 5; 


    const searchRegExp = new RegExp('.*'+ search + '.*','i') ; 
    
    const filter = {
        userType: 'fillingStationOwner',
        isAdmin: {$ne: true},
        $or:[  
            {name:{$regex:searchRegExp}},
            {email:{$regex:searchRegExp}},
            {phone:{$regex:searchRegExp}},  
            {nidNo:{$regex:searchRegExp}},       
        ], 
    };


    const options = {
        password:0
    };


    const users = await User.find(filter,options)                                                         
    .limit(limit)
    .skip((page-1) * limit);
    const count = await User.find(filter).countDocuments();

    
    if (users.length === 0) {
      throw createError(404, 'Filling Station Owner Not found');
    }
   
    return successResponse(res,{
        statusCode:200,
        message:'Users Returned...........',
        payload:{
            users,
            pagination: {
                 totalPages: Math.ceil(count / limit),
                 currentPage:page,
                 previousPage: page - 1> 0 ? page-1 : null,
                 nextPAge: page + 1 <= Math.ceil(count / limit) ? page + 1 : null ,
            },
        },
       
    });

} catch (error){
    next(error);
}
};

const getFillingStationOwnerByIdForAdmin = async (req,res,next) =>{

    try{
        const id = req.params.id;
        const options = {password: 0}
      
        const user = await User.findById({ _id: id, userType: 'fillingStationOwner' }, options);

        if (!user) {
            throw createError(404, 'Filling Station Owner not found');
          }

        return successResponse (res,{
            statusCode: 200,
            message:'user return sucessfully',
            payload: {user},
        });
              
} catch (error){
    next(error);
}
};

const deleteFillingStationOwnerByIdForAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await User.findById({ _id: id, userType: 'fillingStationOwner' }, options);

        if (!user) {
            throw createError(404, 'user not found');
          }

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });
        return successResponse (res,{
            statusCode: 200,
            message:'user delete sucessfully',
         
        });
              
} catch (error){
    next(error);
}
};

  



module.exports = {
    getUsersForAdmin,
    getUserByIdForAdmin,
    deleteUserByIdForAdmin,
    updateUserByIdForAdmin,
    userBannedByIdForAdmin,
    userUnbannedByIdForAdmin,
    userToFillingStationOwnerByIdForAdmin,
    userToUnFillingStationOwnerByIdForAdmin,
    getFillingStationOwnerForAdmin,
    getFillingStationOwnerByIdForAdmin,
    deleteFillingStationOwnerByIdForAdmin
    
    
};