import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeMyPosts : (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { username, yyyymmdd } = args;
            const { user } = request;
            return prisma.posts({ 
                where: {
                    AND : [
                        { user : { username }},
                        { yyyymmdd }
                    ]
                },
                orderBy: "startAt_ASC"
            })
            
        }
    }
}