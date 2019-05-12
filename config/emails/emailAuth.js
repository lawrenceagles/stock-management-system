// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const deleteAccountEmail = (email, firstname, lastname)=>{
	const msg = {
	  to: email,
	  from: 'vetiva@gmail.com',
	  subject: "ACCOUNT CANCELLATION",
	  text: `Hello ${lastname} ${firstname} your account has been successfully deleted`
	};

	sgMail.send(msg);
}

const sendToOne = (email, firstname, lastname, body)=>{
	let msg = {
	  to: email,
	  from: 'vetiva@gmail.com',
	  subject: "NEW NOTIFICATION",
	  text: `${body}`
	};

	sgMail.send(msg);
}

const sendToMultiple = (email, body)=>{
	const msg = {
	  to: [email],
	  from: 'vetiva@gmail.com',
	  subject: 'NEW NOTIFICATION',
	  text: `${body}`,
	  html: `<p>${body}</p>`,
	};
	sgMail.send(msg);
}

const sendToApproveUpdate = (email, userCompany, firstname, lastname)=>{
	const msg = {
	  to: [email],
	  from: `${userCompany}`,
	  subject: `REQUEST TO EDIT PROFILE DATA`,
	  text: `Hello Vetiva Admin. I am, ${lastname} ${firstname} from ${user.Company}. I am making a request to edit my personal data.`,
	  html: `<p>Hello Vetiva Admin. I am, ${lastname} ${firstname} from ${user.Company}</p> <p>I am making a request to edit my personal data.</p>`,
	};
	sgMail.send(msg);
}


const sendUpdatePasswordEmail = (email, firstname, lastname, password)=>{
	const msg = {
	  to: email,
	  from: 'vetiva@gmail.com',
	  subject: `PASSWORD UPDATE REQUEST`,
	  text: `${lastname} ${firstname} has made a request to retrive passord, please login with the passowrd: ${password} and update your password or kindly ignore this mail if it is not you.`
	};

	sgMail.send(msg);
}

const sendWelcomePasswordEmail = (email, firstname, lastname, password)=>{
	const msg = {
	  to: email,
	  from: 'vetiva@gmail.com',
	  subject: `WELCOME TO VETIVA SHARE SCHEME MANAGEMENT PROGRAM`,
	  text: `${lastname} ${firstname}, your account has been successfully created. Kindly login with the password ${password}`
	};

	sgMail.send(msg);
}

const sendUserWelcomePasswordEmail = (email, firstname, lastname, password)=>{
	const msg = {
	  to: email,
	  from: 'vetiva@gmail.com',
	  subject: `WELCOME TO VETIVA SHARE SCHEME MANAGEMENT PROGRAM`,
	  text: `${lastname} ${firstname}, your account has been successfully created. Kindly login with the password ${password}`
	};

	sgMail.send(msg);
}

module.exports = {
	sendWelcomePasswordEmail,
	sendUserWelcomePasswordEmail,
	deleteAccountEmail,
	sendUpdatePasswordEmail,
	sendToOne,
	sendToMultiple,
	sendToApproveUpdate
}
