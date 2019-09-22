import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getDoingLogs } from "../../../utils";

export default {
    Query : {
        seeDayLog: async(_, { username, yyyymmdd }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd, user: { username } }
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            const dayReviews = await prisma.reviews({ where: {
                yyyymmdd,
                user : { username }
            }})

            const dayComments = await prisma.comments({ where: { post : {
                yyyymmdd,
                user : { username }
            }}});

            return { dayReviews, dayComments, averageScore, doingLogs, posts } 
        }
    }
}