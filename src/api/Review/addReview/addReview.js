import { prisma } from "../../../../generated/prisma-client";
import { getYyyymmdd } from "../../../utils";

export default {
    Mutation : {
        addReview: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { text } = args;
            const { user } = request;
            const when = getYyyymmdd( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
            if ( text !== "" ) {
                return prisma.createReview({
                    text, when, 
                    user : { connect : { id : user.id } }
                });
            } else {
                throw Error("Caption is empty");
            }
        }
    }
}