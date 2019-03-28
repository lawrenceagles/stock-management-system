const mongoose = require('mongoose');

const User = require('./user');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 120,
        trim: true,
        unique:true
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    schemeBatch:[{
        name: {
            type: String
        },
        totalShares:{
            type: Number,
            default: 0
        }
    }],
    sharePrice:{
        type: Number
    },
    totalSchemeMembers: {
        type: Number,
        required: true,
        default: 0
    },
    totalSharesAllocatedToScheme: {
        type: Number,
        required: true
    },
    totalSharesAllocatedToSchemeMembers: {
        type: Number,
        default: 0,
        required: true
    },
    totalUnallocatedShares: {
        type: Number,
        default: 0,
        required: true
    },
    totalSharesForfieted: {
        type: Number,
        default: 0
    },
    totalSharesOfUnconfirmedSchemeMembers: {
        type: Number,
        default: 0
    },
    totalSharesRepurchased:{
        type: Number,
        default: 0
    },
    totalDividentDeclared: {
        type: Number,
        required: true
    },
    vestingSchedule:{
        type:String,
        required:true
    },
    dateOfAllocation: {
        type: Date,
        required: true
    },
    dividendTypeShare: {
        type: String,
        required: true
    },
    dividendTypeCash: {
        type: Boolean,
        required: true
    },
    dividendRatePerShares: {
        type: Number, // is this still needed?
        required: true,
        rate: {
            given: Number,
            value: Number,
        }
    },
    canBuyShares: {
        type: Boolean,
        required: true
    },
    bonus:{
        type:String,
        default:0,
        maxlength:200
    },
    canSellShares: {
        type: Boolean,
        required: true
    },
    canCollateriseShares: {
        type: Boolean,
        required: true        
    },

    currentShareValuation: {
        type: Number,
        required: true
    },
    canRepurchase: {
        type: Boolean,
        required: true
    },
    initialShareSale: {
        type: Number,
        required: true
    },
    schemeRules: {
        type: String,
        required: true
    }    
});


companySchema.virtual('staffs', {
  ref: 'User',
  localField: '_id',
  foreignField: 'company'
});


const Company = mongoose.model('Company', companySchema);
module.exports = {Company};