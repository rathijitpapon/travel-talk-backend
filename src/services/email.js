const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ADDRESS,
        subject: 'Thanks for joining in!',
        text: `Welcome to the Travel Talk community, ${name}.`
    });
};

const sendCancelationEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: process.env.EMAIL_ADDRESS,
    //     subject: 'Sorry to see you go!',
    //     text: `Goodbye, ${name}. We hope to see you back sometime soon.`
    // });
};

const sendForgetPasswordEmail = (email, name, password) => {
    // sgMail.send({
    //     to: email,
    //     from: process.env.EMAIL_ADDRESS,
    //     subject: 'Please change the password after logging in.',
    //     text: `Hey, ${name}. Here is your new password: ${password}. Please change it as soon as you logged in.`,
    // });
};

const emaiNotification = {
    sendWelcomeEmail,
    sendCancelationEmail,
    sendForgetPasswordEmail,
};;

module.exports = emaiNotification;