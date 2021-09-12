const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
    
    agentName: {
        type: String,
    }
}, { timestamps: true })
module.exports = mongoose.model('Agents', agentSchema);