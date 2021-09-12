const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    firstName: {
        type: String,
        required: true
    },
    DOB:{
        type:Date
    },
    address:{
        type: String
    },
    phoneNumber: {
        type: Number,
    },
    state:{
        type: String
    },
    zipCode:{
        type: Number
    },
    email: {
        type: String,
        required: true
    },
    gender:{
        type: String
    },
    
    userType: {
        type: String,
    }
}, { timestamps: true })
module.exports = mongoose.model('Users', userSchema);
