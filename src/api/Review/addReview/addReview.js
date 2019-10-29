import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        addReview: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { username, text, yyyymmdd } = args;
            const { user } = request;

            if ( user.username === username ) {
                if ( text !== "" ) {
                    return prisma.createReview({
                        text, 
                        yyyymmdd,
                        user : { connect : { id : user.id } }
                    });
                } else {
                    throw Error("Caption is empty!");
                }
            } else {
                throw Error("Not your review!");
            }
        }
    }
}