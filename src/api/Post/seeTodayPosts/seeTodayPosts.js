import { prisma } from "../../../../generated/prisma-client";
import { getYyyymmdd } from "../../../utils";

export default {
    Query : {
        seeTodayPosts : (_, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user : { username } } = request;

            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate( yesterday.getDate() -1 );

            const yyyymmdd = getYyyymmdd( today.getFullYear(), today.getMonth(), today.getDate() );
            const yyyymmddYesterday = getYyyymmdd( yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() );
            
            return prisma.posts({
                where : {
                    OR : [
                        {
                            user: { username },
                            yyyymmdd
                        },
                        {
                            user: { username },
                            yyyymmdd : yyyymmddYesterday
                        }
                    ]
                }
            })
        }
    }
}