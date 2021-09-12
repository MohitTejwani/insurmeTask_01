const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LOBSchema = new Schema({
    
    categoryName: {
        type: String
    }
}, { timestamps: true })
module.exports = mongoose.model('LOB', LOBSchema);