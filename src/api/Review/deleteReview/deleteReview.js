import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        deleteReview : async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id } = args;
            const { user } = request;
            const review = await prisma.$exists.review({
                AND: [
                    { id },
                    { user : { id : user.id }}
                ]
            });
            if ( review ) {
                try {
                    await prisma.deleteReview({ id });
                    return true;
                } catch {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
}