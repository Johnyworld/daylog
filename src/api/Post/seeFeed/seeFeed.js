import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeFeed : async(_, {limit=20, offset=0}, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            const posts = await prisma.posts({
                where: {
                    OR : [
                        { user: { followers_some: { id: user.id } } },
                        { user: { id: user.id }}
                    ]
                },
                first: limit + offset,
                orderBy: "updatedAt_DESC"
            })

            const reviews = await prisma.reviews({
                where: {
                    OR : [
                        { user: { followers_some: { id: user.id } } },
                        { user: { id: user.id }}
                    ]
                },
                first: limit + offset,
                orderBy: "createdAt_DESC"
            })

            const all = [ ...posts, ...reviews ]
                .sort((a, b) => a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0 )
                .slice( 0, offset + limit )
            
            let postsI = all.filter( item => item.startAt );
            let reviewsI = all.filter( item => !item.startAt );

            return { 
                posts: postsI,
                reviews: reviewsI
            }
        }
    }
}