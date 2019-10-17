import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        editDoing : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, color, icon } = args;
            const { user } = request;

            const doing = await prisma.$exists.doing({ 
                id,
                author: { id: user.id }
            });
            
            if ( doing ) {
                try {
                    await prisma.updateDoing({
                        where: { id },
                        data: { color, icon }
                    })
                    return true;
                } catch(error) {
                    return false;
                }
            } else throw Error("Not your doing!")
        }
    }
}