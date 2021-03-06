import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeCategoryList : () => {
            return prisma.categories({ orderBy: "name_ASC" });
        }
    }
}