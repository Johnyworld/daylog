import { prisma } from "../../../../generated/prisma-client";
import { getToday, getYesterday } from "../../../utils";

export default {
    Mutation : {
        upload: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { doingId, location="", startAt, score, option } = args;
            const { user } = request;

            const yyyymmdd = getToday();
            const yesterday = getYesterday(yyyymmdd);

            const postExists = await prisma.$exists.post({
                OR : [
                    {
                        yyyymmdd,
                        startAt
                    },
                    {
                        yyyymmdd,
                        endAt : startAt + 1
                    },
                    {
                        yyyymmdd: yesterday,
                        startAt : startAt + 96
                    },
                    {
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