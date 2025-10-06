const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const appUtils = require("../appUtils");

const readHTMLFile = (path, callback) => {
    fs.readFile(
        path,
        {
            encoding: "utf-8"
        },
        function (err, html) {
            if (err) {
                throw err;
            } else {
                callback(null, html);
            }
        }
    );
};

const sendMail = async payload => {
    try {
        const transporter = nodemailer.createTransport({
            /* Your email configuration goes here */
            service: payload?.service?payload.service:'Gmail',
            auth: {
                user: payload?.user?payload.user:'support@prepinsta.com',
                pass: payload?.pass?payload.pass:'zbxt wcan ntfo ddlv'
            }
        });

        const fromEmail = payload?.fromEmail?payload.fromEmail:'"Optimus By PrepInsta Prime" <support@prepinsta.com>';
        const toEmail = payload.to;
        const subject = payload.subject;

        readHTMLFile(__dirname + `/emailTemplate/${payload.template}`, function (
            err,
            html
        ) {
            if (err) {
                throw err;
            }

            const template = handlebars.compile(html);
            const data = payload.data;
            const htmlToSend = template(data);

            const mailOptions = {
                from: fromEmail,
                to: toEmail,
                subject: subject,
                html: htmlToSend
            };

            if (payload.attachment && payload.attachment.length) {
                mailOptions.attachments = payload.attachment;
            }

            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('mail-error', err);
                        reject(err);
                    } else {
                        console.log('mail-response', info.response);
                        resolve(info.response);
                    }
                });
            });
        });
    } catch (error) {
        appUtils.logError({moduleName:"services-email" , methodName : "email",error });
        throw error;
    }
};

const sendMailPrime = async payload => {
    try {
        const transporter = nodemailer.createTransport({
            service: payload?.service?payload.service:'Gmail',
            auth: {
                user: payload?.user?payload.user:'support@prepinsta.com',
                pass: payload?.pass?payload.pass:'zbxt wcan ntfo ddlv'
            }
        });

        const fromEmail = payload?.fromEmail?payload.fromEmail:'"PrepInsta Prime" <support@prepinsta.com>';
        const toEmail = payload.to;
        const subject = payload.subject;

        readHTMLFile(__dirname + `/emailTemplate/${payload.template}`, function (
            err,
            html
        ) {
            if (err) {
                throw err;
            }

            const template = handlebars.compile(html);
            const data = payload.data;
            const htmlToSend = template(data);

            const mailOptions = {
                from: fromEmail,
                to: toEmail,
                subject: subject,
                html: htmlToSend
            };

            if (payload.attachment && payload.attachment.length) {
                mailOptions.attachments = payload.attachment;
            }

            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('mail-error', err);
                        reject(err);
                    } else {
                        console.log('mail-response', info.response);
                        resolve(info.response);
                    }
                });
            });
        });
    } catch (error) {
        appUtils.logError({moduleName:"services-email" , methodName : "sendMailPrime",error });
        throw error;
    }
};

module.exports = {
    sendMail,
    sendMailPrime
};
