import FormData from 'form-data';
import { DateTime } from 'luxon';
import { isLocalEnvironment, isProductionEnvironment } from '../helpers/utils.helper';
import nodemailer from "nodemailer";
import mailConfig from './mail.config';
import { EVerificationAction } from '../user-verification/models/user-verification.model';


const adminEmails = ['readerapp2018@gmail.com'];


const emailTemplatesMap = {
    'user-email-verification': 'user-email-verification',
    'reset-account-password': 'reset-account-password',
};


type SimpleTypes = any;

export class EmailClient {
    private static async sendMail({
        sender = "Reader App <no-reply@readerapp2018@gmail.com>",
        recipients,
        subject,
        template,
        variables,
    }: {
        sender?: string;
        recipients: string[];
        subject: string;
        template: string;
        variables: Record<string, SimpleTypes | Record<string, SimpleTypes>>;
    }) {
        const APP_ENV = process.env.APP_ENV as string;
        const isProdEnv = isProductionEnvironment(APP_ENV);
        const transporter = nodemailer.createTransport(mailConfig);

        const mailData = {
            from: sender,
            to: recipients,
            template,
            subject: `${!isProdEnv ? '[Test Mode]' : ''} ${subject}`,
            'h:X-Mailgun-Variables': JSON.stringify(variables),
            context: variables,
        };

        await transporter.sendMail(mailData);
    }

    public static async sendAccountVerification({
        email,
        verificationLink,
    }: {
        email: string;
        verificationLink: string;
        action: EVerificationAction;
    }) {
        const emailData = {
            recipients: [email],
            subject: 'Account Email Verification',
            template: emailTemplatesMap['user-email-verification'],
            variables: { verificationLink, currentYear: DateTime.now().toFormat('yyyy') },
        };

        return EmailClient.sendMail(emailData);
    }
}