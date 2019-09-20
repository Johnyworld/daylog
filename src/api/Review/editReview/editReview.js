import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        editReview : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, text } = args;
            const { user } = request;
            const review = await prisma.$exists.review({
                AND: [
                    { id },
                    { user : { id : user.id }}
                ]
            })
            if ( review ) {
                return prisma.updateReview({ where: { id }, data: { text } });
            } else {
                throw Error("It is not my review")
            }
        }
    }
}