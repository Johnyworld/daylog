import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getDoingLogs, getYesterday } from "../../../utils";

export default {
    Query : {
        seeDayLog: async(_, { username, yyyymmdd }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd, user: { username } },
                orderBy: "startAt_ASC"
            });

            const yesterday = getYesterday(yyyymmdd);
            const yesterdayLastPost = await prisma.posts({
                where: { yyyymmdd: yesterday, user: { username } },
                orderBy: "endAt_DESC",
                first: 1
            })

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);
            
            const dayReviews = await prisma.reviews({ where: {
                yyyymmdd,
                user : { username }
            }})

            return { dayReviews, averageScore, doingLogs, posts: [ ...yesterdayLastPost, ...posts ] } 
        }
    }
}