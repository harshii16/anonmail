const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.static('public'));

//View Engine
app.set('view engine', 'ejs');

//Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes 
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/send', (req, res) => {
    const email = {
        target: req.body.target,
        subject: req.body.subject,
        body: req.body.body,
    };
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        requiresAuth: true,
        domains: ["gmail.com", "googlemail.com"],
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: '"AnonMail" <mailer.anonmailh@gmail.com>', // sender address
        to: email.target, // list of receivers
        subject: `AnonMail : ${email.subject}`,// Subject line
        text: `${email.body} \n\n This email was sent anonymously using AnonMail. AnonMail does not endorse the contents of this email.`, // plain text body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    res.render('sent', { target: email.target });
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(process.env.PORT || 5000, () => console.log('Server started on localhost:5000'));