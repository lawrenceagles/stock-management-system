const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const batchSchema = new Schema({  
        allocatedShares: {
            type: Number,
            required: [true, 'This field is required']
        },
        allocationDate: {
            type: Date,
            required: [true, 'This field is required']
        },
        vesting:{
            schedule:{
                type: String
            },
            period:{
                type: Number
            }
        },
        company:{
        	type: mongoose.Schema.Types.ObjectId,
	        required: true,
	        ref: 'Company'
        },
        members:[{
        	type: mongoose.Schema.Types.ObjectId,
	        ref: 'User'
        }]
    });

const Batch = mongoose.model('Batch', batchSchema);
module.exports = {Batch};
