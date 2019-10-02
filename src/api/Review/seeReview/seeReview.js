import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeReview : (_, args) => {
            const { id } = args;
            return prisma.review({ id });
        }
    }
}