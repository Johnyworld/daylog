import "./env";
import { words } from './words';
import jwt from 'jsonwebtoken';
import { prisma } from "../generated/prisma-client";

export const generateSecret = () => {
    let secretText = "";
    for ( let i=0; i<5; i++ ) secretText += words[Math.floor( Math.random() * words.length )];
    return secretText;
}

export const sendSecretMail = ({ to, subject, html }) => {
    const sendmail = require('sendmail')();
    sendmail({
        from: 'no-reply@daylog.com',
        to,
        subject,
        html
      }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
}

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET);

export const timeToBlock = ( hour, minute ) => {
    return hour*4 + Math.floor(minute/15);
}

export const getYyyymmdd = ( year, month, date ) => {
    month += 1;
    return `${year}-${(month>9?'':"0")+month}-${(date>9?'':"0")+date}`;
}

export const getToday = () => {
    const today = new Date();
    return getYyyymmdd( today.getFullYear(), today.getMonth(), today.getDate() );
}

export const getYesterday = (yyyymmdd) => {
    const today = new Date( yyyymmdd );
    today.setDate( today.getDate() -1 );
    return getYyyymmdd( today.getFullYear(), today.getMonth(), today.getDate() ); 
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