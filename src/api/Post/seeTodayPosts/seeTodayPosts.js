import { prisma } from "../../../../generated/prisma-client";
import { getYesterday } from "../../../utils";

export default {
    Query : {
        seeTodayPosts : (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { yyyymmdd } = args;
            const { user : { username } } = request;

            const yesterday = getYesterday(yyyymmdd);
            
            return prisma.posts({
                where : {
                    OR : [
                        {
                            user: { username },
                            yyyymmdd
                        },
                        {
                            user: { username },
                            yyyymmdd : yesterday
                        }
                    ]
                }
            })
        }
    }
}