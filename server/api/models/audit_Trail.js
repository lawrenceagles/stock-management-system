const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Audit_Trail_Schema = new Schema({
	id: {
		type: Number,
		required: true
	},
	action: {
		type: String,
		required: true
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	createdAT: {
		type: Date,
		default: Date.now
	}
});


const Audit_Trail = mongoose.model('Audit_Trail', Audit_Trail_Schema);
module.exports = {Audit_Trail};