import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        unFollow: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id } = args;
            const { user } = request;
            try {
                if ( id === user.id ) {
                    throw Error("Can't unfollow your self");
                } else {
                    await prisma.updateUser({
                        where: { id: user.id },
                        data: { following: { disconnect : { id } } }
                    });
                    return true;
                }
            } catch {
                return false;
            }
        }
    }
}