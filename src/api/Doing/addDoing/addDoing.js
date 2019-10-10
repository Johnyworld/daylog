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
                author: { connect: { id: user.id }},
            });
            await prisma.createPin({
                user: { connect: { id: user.id }},
                doing: { connect: { id: doing.id }}
            })
            return doing;
        }
    }
}