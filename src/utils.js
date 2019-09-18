import "./env";
import { words } from './words';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

export const showMessage = (lang, category, item) => {
    if ( lang === 'KR' ) return require("./lang/kr.json")[category][item];
    if ( lang === 'EN' ) return require("./lang/en.json")[category][item];
}

export const generateSecret = () => {
    let secretText = "";
    for ( let i=0; i<5; i++ ) secretText += words[Math.floor( Math.random() * words.length )];
    return secretText;
}

const sendMail = email => {
    const options = {
        auth: {
            api_user: process.env.SENDGRID_USERNAME,
            api_key: process.env.SENDGRID_PASSWORD 
        }
    }
    const client = nodemailer.createTransport( sgTransport(options) );
    return client.sendMail(email);
}

export const sendSecretMail = (address, secret, username, lang) => {
    const subject = showMessage(lang, 'sendSecret', 'subject');
    const greeting = showMessage(lang, 'sendSecret', 'greeting'); 
    const html = showMessage(lang, 'sendSecret', 'html');
    const email = {
        from : "johnyworld@naver.com",
        to : address,
        subject,
        html: `<span style="font-size:16px">${greeting} <strong>${username}</strong>${html}</span><br/><br/><strong style="background-color:#1a9df9; color: white; font-size:32px; padding: 5px 10px;">${secret}</strong>` 
    }
    return sendMail(email);
}