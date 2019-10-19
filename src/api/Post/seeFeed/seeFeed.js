import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeFeedPost : async(_, {limit=10, offset=0}, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            const posts = await prisma.posts({
                where: {
                    OR : [
                        { user: { followers_some: { id: user.id } } },
                        { user: { id: user.id }}
                    ]
                },
                first: limit,
                skip: offset,
                orderBy: "updatedAt_DESC"
            })

            // const reviews = await prisma.reviews({
            //     where: {
            //         OR : [
            //             { user: { followers_some: { id: user.id } } },
            //             { user: { id: user.id }}
            //         ]
            //     },
            //     first: offset + limit,
            //     orderBy: "createdAt_DESC"
            // })

            // const all = [ ...posts, ...reviews ]
            //     .sort((a, b) => a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0 )
            //     .slice( offset, offset + limit )
            //     .map( item => ({ ...item, __typename: 'Feed' }));
            
            // let postsI = all.filter( item => item.startAt );
            // let reviewsI = all.filter( item => !item.startAt );

            return posts;
            // return { 
            //     posts: postsI,
            //     reviews: reviewsI
            // }
        },

        seeFeedReview : async(_, {limit=10, offset=0}, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;

            const reviews = await prisma.reviews({
                where: {
                    OR : [
                        { user: { followers_some: { id: user.id } } },
                        { user: { id: user.id }}
                    ]
                },
                first: limit,
                skip: offset,
                orderBy: "createdAt_DESC"
            });
            return reviews;
        }
    }
}