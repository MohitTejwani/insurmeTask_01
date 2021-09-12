const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const policySchema = new Schema({

    policyNumber: {
        type: String,
        required: true
    },
    policyStartDate: {
        type: Date
    },
    policyEndDate: {
        type: Date
    },
    policyCategory: {
        type: Schema.Types.ObjectId,
        ref: "LOB",
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Carriers",
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: "Agents",
    },
    premiumAmount: {
        type: SchemaTypes.Double,
    },
    policyMode:{
        type:Number
    }

}, { timestamps: true })
module.exports = mongoose.model('Policies', policySchema);

