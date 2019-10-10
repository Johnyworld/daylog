import { prisma } from "../../../generated/prisma-client";

export default {
    Doing : {
        author: ({ id }) => prisma.doing({ id }).author(),
        category: ({ id }) => prisma.doing({ id }).category(),
        pins: ({ id }) => prisma.doing({ id }).pins(),
        posts: ({ id }) => prisma.doing({ id }).posts(),

        pinsCount: ({ id }) => prisma.pinsConnection({
            where: { doing: { id }}
        }).aggregate().count(),

        postsCount: ({ id }) => prisma.postsConnection({
            where: { doing : { id } }
        }).aggregate().count(),

        blocksCount: async({ id }) => {
            let total = 0;

            const posts = await prisma.postsConnection({
                where: { doing: { id } }
            }).edges();

            posts.map( post => {
                const startAt = post.node.startAt;
                const endAt = post.node.endAt;
                if ( startAt && endAt ) {
                    total += endAt - startAt;
                }
            });
            return total;
        },

        isFollowing: ({ id }, _, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            return prisma.$exists.user({
                id: user.id, doings_some: { id }
            })
        }
    }
}