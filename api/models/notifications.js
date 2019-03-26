const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema([{
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
  	},
  	createdAt: {
  		type: Date,
  		default: Date.now
  	}
}]
);

const Notifcations = mongoose.model('Notifcations', notificationSchema);
module.exports = {Notifcations};