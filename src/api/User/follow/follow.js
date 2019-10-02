import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        follow : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id } = args;
            const { user } = request;
            try {
                if ( user.id === id ) {
                    throw Error("Can't follow your self");
                } else {
                    await prisma.updateUser({ 
                        where: { id: user.id },
                        data: { following: { connect: { id } } }
                    });
                    return true;
                }
            } catch {
                return false;
            }
        }
    }
}