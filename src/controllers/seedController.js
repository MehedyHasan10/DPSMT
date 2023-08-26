const data = require('../data');
const User = require('../models/userModel');

const seedUser = async (req,res,next) =>{
    try{
        //deleting all exiting users
        await User.deleteMany({});

        //inserting new users

        const users = await User.insertMany(data.users);

        //successfull response
        return res.status(201).json(users);



    } catch(error){
        next(error);
    }
};



module.exports = {seedUser};