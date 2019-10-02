import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getDoingLogs } from "../../../utils";

export default {
    Query : {
        seeYearLog : async(_, { username, yyyymmdd }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyymmdd, user: { username } }
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            const yearReview = await prisma.reviews({ where : { 
                yyyymmdd: yyyymmdd,
                user : { username }
            }});

            return { yearReview, averageScore, doingLogs }
        }
    }
}