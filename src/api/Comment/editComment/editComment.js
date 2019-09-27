import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        editComment: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, text, action } = args;
            const { user } = request;
            const post = await prisma.$exists.comment({ id, user : { id : user.id } });
            if ( post ) {
                if ( text && action === "EDIT" ) await prisma.updateComment({ where: { id }, data: { text } });
                else if  ( action === "DELETE" ) await prisma.deleteComment({ id });
                return true;
            } else {
                throw Error("This comment is not yours")
            }
        }
    }
}