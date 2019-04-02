const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dividendSchema = new Schema({
    type:{
        type: String,
        enum: ['cash', 'share']
    },
    rate:{
        type: Number
    },
    amount:{
        type: Number
    },
    {
        timestamps: true
    }
})
