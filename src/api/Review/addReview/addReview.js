import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        addReview: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { text, yyyymmdd } = args;
            const { user } = request;
            if ( text !== "" ) {
                return prisma.createReview({
                    text, 
                    yyyymmdd,
                    user : { connect : { id : user.id } }
                });
            } else {
                throw Error("Caption is empty");
            }
        }
    }
}