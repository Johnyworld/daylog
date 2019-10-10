import { prisma } from "../../../../generated/prisma-client";
import { timeToBlock, getYyyymmdd } from "../../../utils";

export default {
    Mutation : {
        upload: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { doingId, location="", startAt, score, option } = args;
            const { user } = request;

            const yyyymmdd = getYyyymmdd( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
            const yesterday = getYyyymmdd( new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1 );
            
            const postExists = await prisma.$exists.post({
                OR : [
                    {
                        yyyymmdd, 
                        endAt : startAt + 1
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