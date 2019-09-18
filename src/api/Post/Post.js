import { prisma } from "../../../generated/prisma-client";

export default {
    Post : {
        user: ({ id }) => prisma.post({ id }).user(),
        doing: ({ id }) => prisma.post({ id }).doing()
    }
}