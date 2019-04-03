const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dividendSchema = new Schema({
    type:{
        type: String,
        enum: ['cash', 'share']
    },
    rate:{
        value: {
            type:Number
        },
        per: {
            type: Number
        }
    },
    bonus_Shares:{
        type: Number,
        trim: true
    },
    dateDeclared:{
        type: Date,
        default: Date.now
    },
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please specify a company declaring this dividend"],
        ref: 'Company'
    }]
})

const Dividend = mongoose.model('Dividend', dividendSchema);

module.exports = {Dividend};