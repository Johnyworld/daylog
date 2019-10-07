import { prisma } from "../../../generated/prisma-client";

export default {
    Category : {
        lang : ({ id }) => prisma.category({ id }).lang(),
    }
}