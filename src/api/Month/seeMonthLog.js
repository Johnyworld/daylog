import { prisma } from "../../../generated/prisma-client";

export default {
    Query : {
        seeMonthLog : async(_, { username, yyyymm }) => {
            const posts = await prisma.posts({
                where: { yyyymmdd_starts_with: yyyymm, user: { username } }
            });

            let totalBlocks = (( total=0 )=>{
                posts.map(post => total += post.endAt - post.startAt);
                return total;
            })();

            let averageScore = (( total=0, hasScore=0 )=>{
                posts.map(post => { 
                    if ( post.score ) hasScore += 1; 
                    return total += post.score;
                });
                return (total / hasScore).toFixed(1);
            })();

            const doingLogs = await posts.map(async post => {
                const blocks = post.endAt - post.startAt;
                return {
                    name : await prisma.post({ id : post.id }).doing().name(),
                    blocks,
                    percent : Math.round(blocks / totalBlocks * 100)
                }
            });

            const weekReviews = await prisma.reviews({ where : { 
                when_starts_with: yyyymm,
                user : { username }
            }});

            const weekComments = await prisma.comments({ where : { post : {
                yyyymmdd_starts_with: yyyymm,
                user : { username }
            }}});

            return { weekReviews, weekComments, averageScore, doingLogs }
        }
    }
}