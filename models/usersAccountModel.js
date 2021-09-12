const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
    
    accountName: {
        type: String,
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Accounts', userAccountSchema);
