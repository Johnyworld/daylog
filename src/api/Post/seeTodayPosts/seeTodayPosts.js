import { prisma } from "../../../../generated/prisma-client";
import { getToday, getYesterday } from "../../../utils";

export default {
    Query : {
        seeTodayPosts : (_, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user : { username } } = request;

            const yyyymmdd = getToday();
            const yesterday = getYesterday();
            
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