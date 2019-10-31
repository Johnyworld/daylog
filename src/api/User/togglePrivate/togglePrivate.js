import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        togglePrivate: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { username } = args;
            const { user } = request;

            if ( username === user.username ) {
                const thisUser = await prisma.user({ username });
                const isPrivate = thisUser.isPrivate;
                await prisma.updateUser({ 
                    where: { username },
                    data: { isPrivate: !isPrivate }
                });
                return true;
                
            } else {
                return false;
            }
        }
    }
}