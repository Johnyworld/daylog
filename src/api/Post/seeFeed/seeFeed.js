import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeFeed : async(_, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            const posts = await prisma.posts({
                where: {
                    OR : [
                        { user: { followers_some: { id: user.id } } },
                        { user: { id: user.id }}
                    ]
                },
                orderBy: "createdAt_DESC"
            })
            const reviews = await prisma.reviews({
                where: {
                    OR : [
                        { user: { followers_some: { id: user.id } } },
                        { user: { id: user.id }}
                    ]
                },
                orderBy: "createdAt_DESC"
            })
            return { posts, reviews }
        }
    }
}