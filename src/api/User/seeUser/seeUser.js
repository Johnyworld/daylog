import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        seeUser: async(_, args) => {
            const { username } = args;
            return await prisma.user({ username });
        }
    }
}