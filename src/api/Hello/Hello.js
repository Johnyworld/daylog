import { prisma } from '../../../generated/prisma-client';

export default {
    Query : {
        hello: async() => {
            console.log( await prisma.users() );
            return "hello";
        } 
    }
};