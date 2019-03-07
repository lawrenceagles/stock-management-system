const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Audit_Trail_Schema = new Schema({
	action: {
		type: String,
		required: true
	},
	createdBy: {
		type: String,
		required: true
	},
	createdAT: {
		type: Date,
		default: Date.now
	}
});

Audit_Trail_Schema.methods.auditTrail = function (admin, doc){
	const log = this;
	// let obj = this.toObject();
	// let newAdmin = _.pick(obj, ['SN', 'createdAt']);
	console.log ("Message: The audit Trail method is working");
}

const Log = mongoose.model('Audit_Trail', Audit_Trail_Schema);
module.exports = {Log};