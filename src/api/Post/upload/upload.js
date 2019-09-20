import { prisma } from "../../../../generated/prisma-client";
import { timeToBlock, getYyyymmdd } from "../../../utils";

export default {
    Mutation : {
        upload: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { doingId, location, score } = args;
            const { user } = request; 
            const startAt = timeToBlock( new Date().getHours(), new Date().getMinutes() );
            const yyyymmdd = getYyyymmdd( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
            const post = await prisma.createPost({ 
                location, score, yyyymmdd,
                startAt, endAt: startAt+1,
                user: { connect : { id: user.id }},
                doing: { connect : { id: doingId }}
            });
            return post;
        }
    }
}