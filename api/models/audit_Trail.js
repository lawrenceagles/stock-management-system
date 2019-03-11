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
	company: {
		type: String,
		required: true,
		default: "Vetiva"
	},
	user: {
		type: String,
	},
},
{
	timestamps: true
});

const Log = mongoose.model('Audit_Trail', Audit_Trail_Schema);
module.exports = {Log};