import { prisma } from "../../../../../generated/prisma-client";

export default {
    Mutation : {
        toggleLike: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { postId } = args;
            const { user } = request;
            const filterOption = {
                AND : [
                    { user : { id: user.id }},
                    { post : { id: postId }}
                ]
            }
            try {
                const existLike = await prisma.$exists.like(filterOption);
                if (!existLike) {
                    await prisma.createLike({
                        user: { connect : { id: user.id }},
                        post: { connect : { id: postId }}
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