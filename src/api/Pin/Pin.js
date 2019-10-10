import { prisma } from "../../../generated/prisma-client";

export default {
    Pin : {
        user: ({ id }) => prisma.pin({ id }).user(),
        doing: ({ id }) => prisma.pin({ id }).doing(),
    }
}