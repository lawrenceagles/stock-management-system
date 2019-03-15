// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

const sendCounsellationEmail = (senderEmail, receiverEmail, firstname, lastname)=>{
	const msg = {
	  to: receiverEmail,
	  from: senderEmail,
	  subject: `Hello ${lastname} ${firstname} you account has been successfully deleted`,
	  text: 'and easy to do anywhere, even with Node.js',
	  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	};

	sgMail.send(msg);
}


const sendBulkEmail = (senderEmail, receiverEmail, firstname, lastname)=>{
	const receiverBulkEmail = receiverEmail.map(email => ({
	    to: [{ email }],
	    substitutions: emailTemplate.substitutions
	}));

	const request = sg.emptyRequest({
	    method: 'POST',
	    path: '/v3/mail/send',
	    body: {
	        personalizations,
	        from: {
	            email: 'vetiva@awwapp.com',
	            name: 'Dorotea from AWW'
	        },
	        template_id: emailTemplate.template_id,
	        categories: emailTemplate.categories
	    }
	});
}



const sendUpdatePasswordEmail = (senderEmail, receiverEmail, firstname, lastname)=>{
	const msg = {
	  to: receiverEmail,
	  from: senderEmail,
	  subject: `Password update request`,
	  text: '${lastname} ${firstname} has made a request to update passord',
	  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	};

	sgMail.send(msg);
}

module.exports = {
	sendCounsellationEmail,
	sendBulkEmail,
	sendUpdatePasswordEmail
}