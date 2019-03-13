const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	title: {
		type: String,
		required: true,
		default: "You have received a new message"
	},
	message: {
		type: String,
		required: true
	},
	sender:{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refpath: 'onModel'
	},
	receiver: [{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refpath: 'onModel'
	}],
	onSenderModel: {
	    type: String,
	    required: true,
	    enum: ['Admin', 'User']
  	},
  	onReceiverModel: {
	    type: String,
	    required: true,
	    enum: ['Admin', 'User']
  	}
},
{
	timestamps:true
});

const Notifcations = mongoose.model('Notifcations', notificationSchema);
module.exports = {Notifcations};