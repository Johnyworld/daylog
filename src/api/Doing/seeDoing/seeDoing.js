import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeDoing : (_, args)=> {
            const { id } = args;
            return prisma.doing({ id });
        }
    }
}