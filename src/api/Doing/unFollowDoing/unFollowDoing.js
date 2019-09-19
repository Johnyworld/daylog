import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        unFollowDoing : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id } = args;
            const { user } = request;
            try {
                await prisma.updateUser({
                    where: { id: user.id },
                    data: { doings: { disconnect : { id } }}
                })
                return true;
            } catch {
                return false;
            }
        }
    }
}