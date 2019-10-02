import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getDoingLogs } from "../../../utils";

export default {
    Query : {
        seeMonthLog : async(_, { username, yyyymmdd }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyymmdd, user: { username } }
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            const monthReview = await prisma.reviews({ where : { 
                yyyymmdd,
                user : { username }
            }});

            const eachReviews = await prisma.reviews({ where : { 
                yyyymmdd_starts_with: yyyymmdd,
                user : { username }
            }, orderBy: "yyyymmdd_DESC" });

            return { monthReview, eachReviews, averageScore, doingLogs }
        }
    }
}