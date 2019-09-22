import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore } from "../../../utils";

export default {
    Query : {
        seeMonthLog : async(_, { username, yyyymm }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyymm, user: { username } }
            });

            let totalBlocks = getTotalBlocks(posts);
            let averageScore = getAverageScore(posts);

            const doingLogs = await posts.map(async post => {
                const blocks = post.endAt - post.startAt;
                return {
                    name : await prisma.post({ id : post.id }).doing().name(),
                    blocks,
                    percent : Math.round(blocks / totalBlocks * 100)
                }
            });

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