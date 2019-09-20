import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore } from "../../../utils";

export default {
    Query : {
        seeYearLog : async(_, { username, yyyy }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyy, user: { username } }
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

            return { averageScore, doingLogs }
        }
    }
}