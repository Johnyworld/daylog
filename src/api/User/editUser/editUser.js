import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        editUser: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { username, fullname, bio, lang } = args;
            const { user } = request;
            const target = await prisma.user({ username });
            if ( target.id === user.id ) {
                return prisma.updateUser({
                    where: { username },
                    data : { fullname, bio, lang }
                }) 
            } else {
                throw Error("It is not me.");
            }
        }
    }
}