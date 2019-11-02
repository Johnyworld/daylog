import { prisma } from "../../../generated/prisma-client";

export default {
    Review : {
        user: ({ id }) => prisma.review({ id }).user(),
        comments: ({ id }) => prisma.review({ id }).comments(),

        commentsCount: ({ id }) => prisma.commentsConnection({
            where: { review: { id }}
        }).aggregate().count(),

        likesCount: ({ id }) => prisma.likesConnection({
            where: { review : { id } }
        }).aggregate().count(),

        isLiked: ({ id }, _, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            return prisma.$exists.like({
                AND : [
                    { review: { id }},
                    { user: { id: user.id }}
                ]
            })
        }
    }
}