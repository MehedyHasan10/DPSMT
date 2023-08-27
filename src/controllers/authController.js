const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('./responseController');



const handleLogin = async (req, res, next) => {
    try {
      // Pick email & password from body
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        throw createError(404, 'User does not exist with this email. Please register first');
      }
  
      // Compare the password with the database (use hash to encrypt)
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw createError(401, 'Email or password did not match');
      }
  
      // Check if the user is banned
      if(user.isBanned){
        throw createError(403, 'You are banned.Please Contact authority');
      }
   
     
      const userWithoutPassword = await User.findOne({ email }).select("-password");
      // Send success response
      return successResponse(res, {
        statusCode: 200,
        message: 'User logged in successfully',
        payload: {userWithoutPassword},
      });
    } catch (error) {
      next(error);
    }
};
  

module.exports={
                handleLogin

                };