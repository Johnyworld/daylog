import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        toggleFavorite : async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { pinId } = args;
            const { user } = request;

            const pin = await prisma.pin({ id: pinId });
            const isFavorite = pin.isFavorite;

            try {
                await prisma.updatePin({ where: { id: pinId }, data: { isFavorite: !isFavorite }});
                return !isFavorite;
                
            } catch {
                return false;
            }
        }
    }
}