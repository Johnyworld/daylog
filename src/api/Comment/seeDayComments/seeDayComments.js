import { getToday, getYesterday } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Query : {
        seeDayComments : (_, __, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;

            const yyyymmdd = getToday();
            const yesterday = getYesterday();

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