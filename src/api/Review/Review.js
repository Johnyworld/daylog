import { prisma } from "../../../generated/prisma-client";

export default {
    Review : {
        user: ({ id }) => prisma.review({ id }).user()
    }
}