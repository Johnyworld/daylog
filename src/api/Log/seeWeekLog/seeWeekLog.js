import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getYyyymmdd, getDoingLogs } from "../../../utils";

const getWeeks = (yyyymmdd) => {
    const today = yyyymmdd.split('-');
    let weeks = [];
    for ( let i=0; i<7; i++ ) {
        const oneDay = new Date();
        oneDay.setFullYear( today[0], today[1]-1, today[2]-i );
        const oneDayPrint = getYyyymmdd( oneDay.getFullYear(), oneDay.getMonth(), oneDay.getDate() );  
        weeks = [ ...weeks, { yyyymmdd : oneDayPrint } ];
    }
    return weeks;
}

export default {
    Query : {
        seeWeekLog : async(_, { username, yyyymmdd }) => {
            const weeks = getWeeks(yyyymmdd);
            const posts = await prisma.posts({
                where: { 
                    OR : weeks,
                    user: { username } 
                },
                orderBy: "yyyymmdd_DESC"
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            const weekReviews = await prisma.reviews({ where : { 
                OR : weeks,
                user : { username }
            }, orderBy: "yyyymmdd_DESC" });

            const weekComments = await prisma.comments({ where : { post : {
                OR : weeks,
                user : { username }
            }}, orderBy: "createdAt_DESC" });

            return { weekReviews, weekComments, averageScore, doingLogs }
        }
    }
}