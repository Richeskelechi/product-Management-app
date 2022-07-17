require('dotenv').config()
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const myNumber = process.env.TWILIO_NUMBER;
const client = require('twilio')(accountSid, authToken);

sendMessage = async (ownerNumber, ownerFullName, senderDetails) => {
    client.messages.create({
        body: 'Hello ' + ownerFullName + " \n" + senderDetails,
        to: ownerNumber,
        from: myNumber
    }).then(message => console.log(message))
        // here you can implement your fallback code
        .catch(error => console.log(error))
}

module.exports = { sendMessage }