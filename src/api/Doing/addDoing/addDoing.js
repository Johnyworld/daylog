import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        addDoing : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            const { name, color, icon, categoryId } = args;
            const doing = await prisma.createDoing({ 
                name, color, icon, 
                category: { connect: { id: categoryId }},
                followers: { connect: { id: user.id }},
                author: user.username,
                authorId: user.id
            });
            return doing;
        }
    }
}