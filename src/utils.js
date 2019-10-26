import "./env";
import { words } from './words';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import jwt from 'jsonwebtoken';
import { prisma } from "../generated/prisma-client";

export const generateSecret = () => {
    let secretText = "";
    for ( let i=0; i<5; i++ ) secretText += words[Math.floor( Math.random() * words.length )];
    return secretText;
}

const sendMail = (email) => {
    const options = {
        auth: {
            api_user: process.env.SENDGRID_USERNAME,
            api_key: process.env.SENDGRID_PASSWORD
        }
    }
    const client = nodemailer.createTransport(sgTransport(options));
    return client.sendMail(email);
}

export const sendSecretMail = ({ to, subject, html }) => {
    const email = {
        from: "no-reply@daylog.com",
        to,
        subject,
        html
    }
    return sendMail(email);
}

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET);

export const timeToBlock = ( hour, minute ) => {
    return hour*4 + Math.floor(minute/15);
}

export const getYyyymmdd = ( date ) => {
    const offset = new Date().getTimezoneOffset() * 60000;
    console.log(new Date( date.getTime() - offset ).toISOString().substr(0, 10))
    return new Date( date.getTime() - offset ).toISOString().substr(0, 10);
}

export const getToday = () => {
    return getYyyymmdd( new Date() );
}

export const getYesterday = (yyyymmdd = getToday()) => {
    const today = new Date( yyyymmdd );
    today.setDate( today.getDate()-1 );
    return getYyyymmdd( today );;
}

export const getTotalBlocks = (posts) => {
    let total = 0;
    posts.map(post => total += post.endAt - post.startAt);
    return total;
}

export const getAverageScore = (posts) => {
    let total = 0;
    let hasScore = 0;
    posts.map(post => { 
        if ( post.score ) hasScore += 1; 
        total += post.score;
    });
    if ( !total ) return 0;
    return (total / hasScore).toFixed(1);
}

export const getDoingLogs = async(posts, totalBlocks) => {
    let doingLogs = [];

    for ( let i=0; i<posts.length; i++ ) {
        const blocks = posts[i].endAt - posts[i].startAt;
        const name = await prisma.post({ id : posts[i].id }).doing().name();
        const postsCount = 1;
        let contains = false;

        if ( doingLogs ) {
            for ( let j=0; j<doingLogs.length; j++ ) {
                if ( doingLogs[j].name === name ) {
                    doingLogs[j].blocks += blocks;
                    doingLogs[j].postsCount += 1;
                    contains = true;
                    break;
                } 
            }
        }
        
        if ( !contains ) doingLogs = [ ...doingLogs, { name, blocks, postsCount } ] 
    }
    
    doingLogs.forEach((log, index) => {
        doingLogs[index].percent = Math.round(log.blocks / totalBlocks * 100); 
    })

    doingLogs.sort((a, b) => a.blocks > b.blocks ? -1 : a.blocks < b.blocks ? 1 : 0 );
    return doingLogs;
}