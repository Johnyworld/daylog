import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeFollowing : (_, args) => {
            const { username } = args;
            return prisma.users({
                where: { followers_some: { username } }
            })
        }
    }
}