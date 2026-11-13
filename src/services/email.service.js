const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Satya Bhai" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name){
    const companyName = "Yutigoo"
    const subject = `Welcome to ${companyName}`;
    const text = `Hello ${name}, In\nThank you for registering at ${companyName}.
                We're excited to have you on board! \n\nBest regards, \nThe ${companyName} Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at ${companyName}.
                We're excited to have you on board !</p><p>Best regards,<br>The ${companyName} Team</p>`;

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Alert";
    const text = `Hi ${name}, you sent ₹${amount} to account ${toAccount}.`;
    const html = `<p>Hi <strong>${name}</strong>, you sent <strong>₹${amount}</strong> to account <strong>${toAccount}</strong>.</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed Alert";
  const text = `Hi ${name}, your transaction of ₹${amount} to account ${toAccount} has failed.`;
  const html = `<p>Hi <strong>${name}</strong>, your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> has failed.</p>`;

  await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
};