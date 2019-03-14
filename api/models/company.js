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
    totalSchemeMembers: {
        type: Number,
        required: true
    },
    totalSharesAllotedToScheme: {
        type: Number,
        required: true
    },
    totalSharesAllotedToSchemeMembers: {
        type: Number,
        required: true
    },
    totalUnallotedShares: {
        type: Number,
        required: true
    },
    totalSharesSold: {
        type: Number,
        required: true
    },
    totalSharesBought: {
        type: Number,
        required: true
    },
    totalSharesForfieted: {
        type: Number,
        required: true
    },
    totalSharesRepurchased: {
        type: Number,
        required: true
    },
    totalDividentDeclared: {
        type: Number,
        required: true
    },
    vestingDate:{
    type:Date,
    required:true
    },
    dateOfAllocation: {
        type: Date,
        required: true
    },
    dividendType: {
        type: String,
        required: true,
        enum: ['cash', 'shares']
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
    canSellShares: {
        type: Boolean,
        required: true
    },
    canCollateriseShares: {
        type: Boolean,
        required: true        
    },
    sharePrice: {
        type: Number,
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
    purchasePrice: {
        type: Number,
        required: true
    },
    
    dateOfPurchase: {
        type: Date,
        required: true
    },
    paymentPeriod:{
        type:String,
        required:true
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