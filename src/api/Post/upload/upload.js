import { prisma } from "../../../../generated/prisma-client";
import { getYesterday } from "../../../utils";

export default {
    Mutation : {
        upload: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { doingId, location="", startAt, score, yyyymmdd, option } = args;
            const { user } = request;

            const yesterday = getYesterday(yyyymmdd);

            const postExists = await prisma.$exists.post({
                OR : [
                    {
                        user : { id: user.id },
                        yyyymmdd,
                        startAt
                    },
                    {
                        user : { id: user.id },
                        yyyymmdd,
                        endAt : startAt + 1
                    },
                    {
                        user : { id: user.id },
                        yyyymmdd: yesterday,
                        startAt : startAt + 96
                    },
                    {
                        user : { id: user.id },
                        yyyymmdd: yesterday,
                        endAt : startAt + 97
                    }
                ]
            });

            if ( !postExists ) {
                const post = await prisma.createPost({ 
                    location, 
                    score, 
                    startAt, 
                    endAt: startAt+1,
                    yyyymmdd: option === "yesterday" ? yesterday : yyyymmdd,
                    user: { connect : { id: user.id }},
                    doing: { connect : { id: doingId }}
                });
                return post;
            } else {
                throw Error('There is a post in same time!');
            }
        }
    }
}