import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        addPin : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { doingId } = args;
            const { user } = request;
            try {
                await prisma.createPin({
                    user: { connect: { id: user.id }},
                    doing: { connect: { id: doingId }}
                })
                return true;
            } catch {
                return false;
            }
        }
    }
}