import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seePost : (_, args) => {
            const { id } = args;
            return prisma.post({ id });
        }
    }
}