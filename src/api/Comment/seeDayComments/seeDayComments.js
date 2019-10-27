import { getYesterday } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeDayComments : (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { yyyymmdd } = args;
            const { user } = request;

            const yesterday = getYesterday(yyyymmdd);

            return prisma.comments({ 
                where: {
                    OR : [
                        { post : { user : { id: user.id }, yyyymmdd }},
                        { post : { user : { id: user.id }, yyyymmdd: yesterday }}
                    ]
                }, orderBy: "createdAt_DESC"
            });
        }
    }
}