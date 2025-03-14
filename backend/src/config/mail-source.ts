import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerOptions } from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";
import { SES } from "aws-sdk";
import * as nodemailer from 'nodemailer';
import * as path from "path";

//ode:101) UnhandledPromiseRejectionWarning: Error: ENOENT: no such file or directory, 
//open '/usr/app/dist/config/modules/mails/templates/jobReport.hbs'
const dir = path.join(__dirname, '..', 'modules', 'mails', 'templates');

function getEtherealOptions() {
    const emailSource: MailerOptions = {
        transport: {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'andrew.tillman55@ethereal.email',
                pass: '9hwF8Ak9DU1pUZZUnm'
            },
        },
        defaults: {
            from: `${process.env.MAIL_FROM}`,
        },
        preview: false,
        template: {
            dir,
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    }

    return emailSource;
}

function getSesOptions() {
    const transport = nodemailer.createTransport({
        SES: new SES({
            apiVersion: "2010-12-01",
            region: process.env.AWS_REGION,
        }),
    });
    const emailSource: MailerOptions = {
        transport,
        defaults: {
            from: `${process.env.MAIL_FROM}`,
        },
        preview: false,
        template: {
            dir,
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    }
    return emailSource;
}


export function getEmailOptions() {

    if (process.env.MAIL_PROVIDER == 'ses') {
        return getSesOptions();
    }
    return getEtherealOptions();

}