import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        searchDoing: (_, args) => {
            const { term } = args;
            return prisma.doings({
                where: {
                    OR: [
                        { name_contains: term },
                        { category: { name_contains: term } }
                    ]
                }
            })
        }
    }
}