const nodeMailer = require('nodemailer');
require('dotenv').config()
sendMail = async (ownerEmail, ownerFullname, senderDetails) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: '"App Admin" <' + process.env.EMAIL_USER + '>',
            to: ownerEmail,
            subject: 'Comment Added',
            text: 'Hello ' + ownerFullname + " \n" + senderDetails,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
            } else {
                // console.log('Email sent: ' + info.response);
            }
        });
    }
    catch (error) {
        res.status(401).json({ msg: 'Error Sending Mail' });
        // console.log('Error  Sending Mail');
    }
}

module.exports = { sendMail }