// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

const deleteAccountEmail = (Email, firstname, lastname)=>{
	const msg = {
	  to: Email,
	  from: 'vetiva@gmail.com',
	  subject: "ACCOUNT CANCELLATION",
	  text: `Hello ${lastname} ${firstname} your account has been successfully deleted`
	};

	sgMail.send(msg);
}

const sendToOne = (Email, firstname, lastname)=>{
	const msg = {
	  to: Email,
	  from: 'vetiva@gmail.com',
	  subject: "DYNAMIC SUBJECT",
	  text: 'DYNAMICALLY GENERATED CONTENT'
	};

	sgMail.send(msg);
}

const sendBulkEmail = (receiversEmail, firstname, lastname, password)=>{
	const receiverBulkEmail = receiversEmail.map(email => ({
	    to: [{ email }],
	    substitutions: emailTemplate.substitutions
	}));

	const request = sg.emptyRequest({
	    method: 'POST',
	    path: '/v3/mail/send',
	    body: {
	        personalizations,
	        from: {
	            email: 'vetiva@gmail.com',
	            name: 'Dorotea from AWW'
	        },
	        template_id: emailTemplate.template_id,
	        categories: emailTemplate.categories
	    }
	});
}



const sendUpdatePasswordEmail = (Email, firstname, lastname, password)=>{
	const msg = {
	  to: Email,
	  from: 'vetiva@gmail.com',
	  subject: `PASSWORD UPDATE REQUEST`,
	  text: `${lastname} ${firstname} has made a request to retrive passord, please login with the passowrd: ${password} and update your password or kindly ignore this mail if it is not you.`
	};

	sgMail.send(msg);
}

const sendWelcomePasswordEmail = (Email, firstname, lastname, password)=>{
	const msg = {
	  to: Email,
	  from: 'vetiva@gmail.com',
	  subject: `WELCOME TO VETIVA SHARE SCHEME MANAGEMENT PROGRAM`,
	  text: `${lastname} ${firstname}, your account has been successfully created. Kindly login with the password ${password}`
	};

	sgMail.send(msg);
}

module.exports = {
	sendWelcomePasswordEmail,
	deleteAccountEmail,
	sendBulkEmail,
	sendUpdatePasswordEmail,
	sendToOne
}