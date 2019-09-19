import { prisma } from "../../../generated/prisma-client";

export default {
    Doing : {
        category: ({ id }) => prisma.doing({ id }).category(),
        followers: ({ id }) => prisma.doing({ id }).followers(),
        posts: ({ id }) => prisma.doing({ id }).posts()
    }
}