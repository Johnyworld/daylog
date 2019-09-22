import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getDoingLogs } from "../../../utils";

export default {
    Query : {
        seeMonthLog : async(_, { username, yyyymm }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyymm, user: { username } }
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            const monthReviews = await prisma.reviews({ where : { 
                yyyymmdd_starts_with: yyyymm,
                user : { username }
            }, orderBy: "yyyymmdd_DESC" });

            const monthComments = await prisma.comments({ where : { post : {
                yyyymmdd_starts_with: yyyymm,
                user : { username }
            }}, orderBy: "createdAt_DESC" });

            return { monthReviews, monthComments, averageScore, doingLogs }
        }
    }
}