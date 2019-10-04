import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeFollowers : (_, args) => {
            const { username } = args;
            return prisma.users({
                where: { following_some: { username } }
            })
        }
    }
}