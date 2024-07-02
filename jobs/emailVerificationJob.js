// Contains the email verification job and worker
const TaskQueue = require("../utils/queue");
const nodeMailer = require("nodemailer");

const EmailJob = (email, username) => {
    // Creates the email job and adds it to the queue
    return new Promise((resolve, reject) => {
        TaskQueue.add("EmailVerification", {
            type: "emailVerification",
            username: username,
            email: email
        }).then(() => {
            console.log("Email Job created successfully");
            resolve();
        }).catch((err) => {
            console.log("Email job creation failed");
            reject(err);
        });
    });
}

TaskQueue.process("EmailVerification", (job, done) => {
    // Worker that processes the email job in the background
    const {email, username} = job.data;
    console.log(`Processing job ${job.id}: Sending email to ${email}`);
    sendEmail(email, username, (err) => {
        if (err) {
            console.log(`Error sending mail to ${email}: ${err}`);
            done(err);
        } else {
            console.log(`Email sent to ${email}`);
            done();
        }
    });
});

function sendEmail(email, username, callback) {
    // sends the email to the respective user
    const transporter = nodeMailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_ACCT,
            pass: process.env.GMAIL_PASS
        }
    });
    const mailOptions = {
        from: "TaskPilot",
        to: email,
        subject: "Email verification",
        html: `<h1>Hello ${username}</h1>
        <p>Welcome to the TaskPilot app, your email has been verified</p>
        <p>Let's get planning</p>`
    }
    transporter.sendMail(mailOptions, callback);
}

module.exports = EmailJob;