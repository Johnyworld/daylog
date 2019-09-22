import { prisma } from "../../../../generated/prisma-client";
import { getTotalBlocks, getAverageScore, getDoingLogs } from "../../../utils";

export default {
    Query : {
        seeYearLog : async(_, { username, yyyy }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyy, user: { username } }
            });

            let totalBlocks = getTotalBlocks(posts);
            const averageScore = getAverageScore(posts);
            const doingLogs = getDoingLogs(posts, totalBlocks);

            return { averageScore, doingLogs }
        }
    }
}