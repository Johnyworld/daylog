import { prisma } from "../../../../generated/prisma-client";
import { getYyyymmdd } from "../../../utils";

export default {
    Query : {
        seeTodayPosts : (_, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user : { username } } = request;
            const yyyymmdd = getYyyymmdd( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
            return prisma.posts({
                where : {
                    user: { username },
                    yyyymmdd
                }
            })
        }
    }
}