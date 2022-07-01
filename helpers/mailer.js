const nodemailer = require('nodemailer');
const domain = process.env.DOMAIN;

async function mailer(email, firstName, userId) {
  let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'myprojectproject@outlook.com',
      pass: 'messi1000',
    }
  });

  let info = await transporter.sendMail({
    from: 'Project 👻 <myprojectproject@outlook.com>',
    to: email, 
    subject: 'Activation Link', 
    text: `Hello ${firstName}.Thank you for registering at ${domain}. Please click on the link below to complete your
           activstion: ${domain}/verify/${userId}`,
    html: `Hello <strong>${firstName}</strong>.<br>Thank you for registering at ${domain}. Please click on the link below to complete your
           activstion: <br><a href=${domain}/verify/${userId}>Verify Me</a> ` // html body
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = mailer;