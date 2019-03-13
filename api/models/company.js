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
    totalSharesForfieted: {
        type: Number,
        required: true
    },
    totalSharesRepurchased:{
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
    level:{
        type:String,
        required:true,
        default:null,
        maxlength:200
    },
    dividendTypeShare: {
        type: Boolean,
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
    purchasePrice: {
        type: Number,
        required: true
    },
    grade:{
        type:String,
        maxlength:190
    },
    paymentPeriod:{
        type:String,
        required:true
    },
    schemeRules: {
        type: String,
        required: true
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]    
});



const Company = mongoose.model('Company', companySchema);
module.exports = {Company};