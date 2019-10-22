import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        removePin : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { doingId } = args;
            const { user } = request;
            try {
                await prisma.deleteManyPins({
                    AND : [
                        { user : { id: user.id }},
                        { doing : { id: doingId }}
                    ]
                });
                return true;
            } catch {
                return false;
            }
        }
    }
}