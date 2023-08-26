require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3334;
const mongodbURL = process.env.MONGODB_ATLAS_URL ||'mongodb://localhost:27017/DPSMT';

module.exports = {
    serverPort,
    mongodbURL,
  
};