import { prisma } from "../../../../generated/prisma-client";

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
                    case "startAt" : return prisma.updatePost({ where: { id }, data: { startAt }});
                    case "endAt" : return prisma.updatePost({ where: { id }, data: { endAt, location: location && location }}); 
                    case "doing" : return prisma.updatePost({ where: { id }, data: { doing : { connect : { id : doingId }}}}); 
                    case "delete" : return prisma.deletePost({ id });
                }
            } else {
                throw Error("It is not your post.")
            }
        }
    }
}