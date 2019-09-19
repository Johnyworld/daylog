import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeFollowing : (_, args) => {
            const { id } = args;
            return prisma.users({
                where: { followers_some: { id } }
            })
        }
    }
}