import { prisma } from "../../../generated/prisma-client";

export default {
    Post : {
        user: ({ id }) => prisma.post({ id }).user(),
        doing: ({ id }) => prisma.post({ id }).doing(),
        comments: ({ id }) => prisma.post({ id }, { 
            orderBy: "yyyymmdd_DESC",
        }).comments(),

        likesCount: ({ id }) => prisma.likesConnection({
            where: { post: { id }}
        }).aggregate().count(),

        commentsCount: ({ id }) => prisma.commentsConnection({
            where: { post: { id }}
        }).aggregate().count(),
        
        blocks: ({ startAt, endAt }) => {
            return endAt - startAt;
        },

        isLiked: ({ id }, _, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            return prisma.$exists.like({
                AND : [
                    { post: { id }},
                    { user: { id: user.id }}
                ]
            })
        }
    }
}