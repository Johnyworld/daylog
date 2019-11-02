import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        addComment: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, text, type } = args;
            const { user } = request;

            if ( type === "post" ) {
                return prisma.createComment({
                    text,
                    user: { connect : { id: user.id }},
                    post: { connect : { id }}
                });

            } else if ( type === "review" ) {
                return prisma.createComment({
                    text,
                    user: { connect : { id: user.id }},
                    review: { connect : { id }}
                });

            } else {    
                throw Error("Type is wrong. it should be one of 'post' or 'review'.")
            }            
        }
    }
}