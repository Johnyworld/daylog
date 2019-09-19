import { prisma } from "../../../../generated/prisma-client";

const EDIT = "EDIT";
const DELETE = "DELETE";

export default {
    Mutation : {
        editComment: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, text, action } = args;
            const { user } = request;
            const post = await prisma.$exists.comment({ id, user : { id : user.id } });
            if ( post ) {
                if ( text && action === EDIT ) return prisma.updateComment({ where: { id }, data: { text } });
                else if  ( action === DELETE ) return prisma.deleteComment({ id });
            } else {
                throw Error("This comment is not yours")
            }
        }
    }
}