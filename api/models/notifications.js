const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	title: {
		type: String,
		required: true,
		default: "You have received a new message"
	},
	body: {
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
	onModel: {
	    type: String,
	    required: true,
	    enum: ['Admin', 'User']
  	},
	{
		timestamp:true
	}
});

const Notifcations = mongoose.model('Notiifcations', notificationSchema);
module.exports = {Notifcations};