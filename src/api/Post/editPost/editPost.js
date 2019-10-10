import { prisma } from "../../../../generated/prisma-client";
import { getYyyymmdd } from "../../../utils";

export default {
    Mutation : {
        editPost: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, doingId, location, score, startAt, endAt, type } = args;
            const { user } = request;
            const post = await prisma.$exists.post({ id, user : { id: user.id } });
            if ( post ) {
                switch(type) {
                    case "score" : return prisma.updatePost({ where: { id }, data: { score } });
                    case "location" : return prisma.updatePost({ where: { id }, data: { location }});
                    case "startAt" : return prisma.updatePost({ where: { id }, data: { startAt, location: location && location }});
                    case "endAt" : return prisma.updatePost({ where: { id }, data: { endAt, location: location && location }}); 
                    case "doing" : return prisma.updatePost({ where: { id }, data: { doing : { connect : { id : doingId }}}}); 
                    case "delete" : return prisma.deletePost({ id });
                    case "stEnYymd" : return prisma.updatePost({ where: { id }, data: { startAt, endAt }}); 
                    case "stEnYymd_YesterToToday" :
                        const yyyymmdd = getYyyymmdd( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
                        return prisma.updatePost({ where: { id }, data: { startAt, endAt, yyyymmdd }}); 
                }
            } else {
                throw Error("It is not your post.")
            }
        }
    }
}