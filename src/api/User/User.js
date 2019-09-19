import { prisma } from "../../../generated/prisma-client";

export default {
    User : {
        followers: ({ id }) => prisma.user({ id }).followers(),
        following: ({ id }) => prisma.user({ id }).following(),
        posts: ({ id }) => prisma.user({ id }).posts(),
        likes: ({ id }) => prisma.user({ id }).likes(),
        doings: ({ id }) => prisma.user({ id }).doings(),
        comments: ({ id }) => prisma.user({ id }).comments(),
        reviews: ({ id }) => prisma.user({ id }).reviews(),
    }
}