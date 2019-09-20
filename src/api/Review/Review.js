import { prisma } from "../../../generated/prisma-client";

export default {
    Review : {
        user: ({ id }) => prisma.review({ id }).user(),

        likesCount: ({ id }) => prisma.likesConnection({
            where: { review : { id } }
        }).aggregate().count()
    }
}