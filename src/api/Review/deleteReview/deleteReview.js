import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        deleteReview : async (_, args) => {
            const { id } = args;
            try {
                await prisma.deleteReview({ id });
                return true;
            } catch {
                return false;
            }
        }
    }
}