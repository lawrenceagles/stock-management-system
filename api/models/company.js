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
        name:{
            type: String,
            required: [true, 'Please enter a batch name']
        },  
        allocatedShares: {
            type: Number,
            required: [true, 'This field is required']
        },
        allocationPerUser:{
            type: Number,
            required: [true, 'This field is required']
        },
        allocationDate: {
            type: Date,
            required: [true, 'This field is required']
        },
        vesting:{
            schedule:{
                type: Number
            },
            Date:{
                type: Date
            }
        }
    }],
    currentShareValue: {
        type: Number,
        required: [true, 'This field is required']
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
    dividend:{
        type:{
            type: String,
            enum: ['cash', 'share']
        },
        rate:{
            type: Number
        },
        date:{
            type: Date
        },
        amount:{
            type: Number
        },
    },
    canBuyShares: {
        type: Boolean,
        required: true
    },
    canSellShares: {
        type: Boolean,
        required: true
    },
    canCollateriseShares: {
        type: Boolean,
        required: true        
    },
    sharesForfieted:{
        type: Number,
        default: 0
    },
    dividend:{
            type:{
                type: String,
                enum: ['cash', 'share']
            },
            rate:{
                type: Number
            },
            date:{
                type: Date
            },
            amount:{
                type: Number
            }
        },
    currentShareValuation: {
        type: Number,
        required: true
    },
    canRepurchase: {
        type: Boolean
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