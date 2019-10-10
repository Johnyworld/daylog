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

        seeFollowedDoings: (_, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            return prisma.doings({
                where: { pins_some: { user : { id: user.id }}}
            })
        }
    }
}