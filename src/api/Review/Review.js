import { prisma } from "../../../generated/prisma-client";

export default {
    Review : {
        user: ({ id }) => prisma.review({ id }).user(),

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