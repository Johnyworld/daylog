import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        addComment: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { postId, text } = args;
            const { user } = request;
            return prisma.createComment({
                text,
                user: { connect : { id: user.id }},
                post: { connect : { id: postId }}
            });
        }
    }
}