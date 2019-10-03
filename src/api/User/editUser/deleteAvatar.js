import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        deleteAvatar : async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id } = args;
            const { user } = request;

            if ( id === user.id ) {
                await prisma.updateUser({ where: { id }, data: {
                    avatar: null
                }})
                return true;
            } else {
                throw Error("Not your account!");
            }
        }
    }
}