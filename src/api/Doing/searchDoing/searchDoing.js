import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        searchDoing: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user: { id }} = request;
            const { term, category } = args;
            return prisma.doings({
                where: {
                    AND : [
                        category && { category: { name: category } },
                        {
                            OR: [
                                { name_contains: term },
                                { category: { name_contains: term } }
                            ]
                        },
                        { pins_none : { user : { id } } }
                    ]
                }
            })
        }
    }
}