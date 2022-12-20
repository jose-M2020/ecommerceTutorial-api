const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
require('dotenv').config()

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env['MAIL_FROM_ADDRESS'],
            pass: process.env['MAIL_PASSWORD']
        }
    }));

    const mailOptions = {
        from: process.env['MAIL_FROM_NAME'],
        ...options
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (!error) {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;