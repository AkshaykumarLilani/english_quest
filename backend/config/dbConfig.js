const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL){
    throw new Error("Mongodb url was not provided");
}

const mongodbConnection = mongoose.connect(MONGO_URL);

module.exports = {
    mongodbConnection
}