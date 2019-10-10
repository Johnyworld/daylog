import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        removePin : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { pinId } = args;
            const { user } = request;
            const pin = await prisma.pin({ id });
            
            try {
                if ( pin.user.id === user.id ) {
                    await prisma.deletePin({ id });
                    return true;
                } else {
                    return false;
                }
            } catch {
                return false;
            }
        }
    }
}