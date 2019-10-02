import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getYyyymmdd, getDoingLogs } from "../../../utils";

const getWeeks = (yyyymmdd) => {
    let weeks = [];

    const thisDay = new Date(yyyymmdd);
    const Y = thisDay.getFullYear();
    const M = thisDay.getMonth();
    const D = thisDay.getDate();

    const whatDay = thisDay.getDay();
    const whatFirstDay = new Date( Y, M, 1 ).getDay();
    const whatWeek = Math.floor(( D + whatFirstDay -1 ) / 7);

    for ( let i=whatDay; i>=0; i-- ) {
        const oneDay = new Date( Y, M, D-i );
        const oneDayPrint = getYyyymmdd( oneDay.getFullYear(), oneDay.getMonth(), oneDay.getDate() ); 
        weeks = [ ...weeks, { yyyymmdd : oneDayPrint } ];
    }

    for ( let i=1; i<7-whatDay; i++ ) {
        const oneDay = new Date( Y, M, D+i );
        const oneDayPrint = getYyyymmdd( oneDay.getFullYear(), oneDay.getMonth(), oneDay.getDate() );   
        weeks = [ ...weeks, { yyyymmdd : oneDayPrint } ]; 
    }

    return { 
        array: weeks.reverse(),
        yyyymmWeek: `${Y}-${(M>9?'':"0")+(M+1)}-W${whatWeek}`,
    };
}

export default {
    Query : {
        seeWeekLog : async(_, { username, yyyymmdd }) => {
            const weeks = getWeeks(yyyymmdd);
            const posts = await prisma.posts({
                where: { 
                    OR : weeks.array,
                    user: { username } 
                },
                orderBy: "yyyymmdd_DESC"
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            const weekReviews = await prisma.reviews({ where : { 
                yyyymmdd : weeks.yyyymmWeek,
                user : { username }
            }, orderBy: "yyyymmdd_DESC" });

            return { weekReviews, averageScore, doingLogs, eachDays:weeks.array }
        }
    }
}