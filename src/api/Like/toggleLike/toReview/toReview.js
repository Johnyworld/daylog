import { prisma } from "../../../../../generated/prisma-client";

export default {
    Mutation : {
        toggleLikeReview: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { reviewId } = args;
            const { user } = request;
            const filterOption = {
                AND : [
                    { user : { id: user.id }},
                    { review : { id: reviewId }}
                ]
            }
            try {
                const existLike = await prisma.$exists.like(filterOption);
                if (!existLike) {
                    await prisma.createLike({
                        user: { connect : { id: user.id }},
                        review: { connect : { id: reviewId }}
                    })
                    return true;
                } else {
                    await prisma.deleteManyLikes(filterOption);
                    return true;
                }
            } catch {
                return false;
            }
        }
    }
}