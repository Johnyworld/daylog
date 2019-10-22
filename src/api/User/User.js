import { prisma } from "../../../generated/prisma-client";

export default {
    User : {
        followers: ({ id }) => prisma.user({ id }).followers(),
        following: ({ id }) => prisma.user({ id }).following(),
        posts: ({ id }) => prisma.user({ id }).posts(),
        likes: ({ id }) => prisma.user({ id }).likes(),
        doings: ({ id }) => prisma.user({ id }).doings(),
        pins: ({ id }) => prisma.user({ id }).pins(),
        comments: ({ id }) => prisma.user({ id }).comments(),
        reviews: ({ id }) => prisma.user({ id }).reviews(),

        postsCount: ({ id }) => prisma.postsConnection({
            where: { user: { id } }
        }).aggregate().count(),

        followersCount: ({ id }) => prisma.usersConnection({
            where: { following_some: { id } }
        }).aggregate().count(),

        followingCount: ({ id }) => prisma.usersConnection({
            where: { followers_some: { id } }
        }).aggregate().count(),

        likesTotal: async({ id }) => {
            const likesOwnComments = await prisma.likesConnection({
                where: { post : { user : { id } } }
            }).aggregate().count();

            const likesOwnReviews = await prisma.likesConnection({
                where: { review : { user : { id } } }
            }).aggregate().count();

            const didLikes = await prisma.likesConnection({
                where: { user : { id }}
            }).aggregate().count();

            return likesOwnComments + likesOwnReviews + didLikes;
        },
        
        isFollowing: async({ id }, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            try {
                return prisma.$exists.user({
                    AND : [
                        { id },
                        { followers_some: { id: user.id } }
                    ]
                });
            } catch {
                return false;
            }
        },

        isSelf: async({ id }, _, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            return user.id === id; 
        }
    }
}