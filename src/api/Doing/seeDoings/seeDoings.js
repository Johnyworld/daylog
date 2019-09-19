import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeDoingsAll: () => {
            return prisma.doings();
        },

        seeDoingsByCategory: (_, args) => {
            const { category } = args;
            return prisma.doings({
                where: { category: { name: category } }
            });
        },

        seeFollowedDoings: (_, args) => {
            const { username } = args;
            return prisma.doings({
                where: { followers_some: { username } }
            })
        }
    }
}