const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	sendBy:{
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	receivedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	{
		timestamp:true
	}
});