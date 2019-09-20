import { prisma } from "../../../../generated/prisma-client";

const SCORE = "SCORE";
const LOCATION = "LOCATION";
const STARTAT = "STARTAT"
const ENDAT = "ENDAT"
const DOING = "DOING"

export default {
    Mutation : {
        editPost: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, doingId, location, score, startAt, endAt, type } = args;
            const { user } = request;
            const post = await prisma.$exists.post({ id, user : { id: user.id } });
            if ( post ) {
                switch(type) {
                    case SCORE : return prisma.updatePost({ where: { id }, data: { score } });
                    case LOCATION : return prisma.updatePost({ where: { id }, data: { location }});
                    case STARTAT : return prisma.updatePost({ where: { id }, data: { startAt }});
                    case ENDAT : return prisma.updatePost({ where: { id }, data: { endAt }}); 
                    case DOING : return prisma.updatePost({ where: { id }, data: { doing : { connect : { id : doingId }}}}); 
                }
            } else {
                throw Error("It is not your post.")
            }
        }
    }
}