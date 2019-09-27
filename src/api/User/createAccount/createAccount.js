import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        createAccount : async(_, args) => {
            const { username, email, fullname="", bio="" } = args;

            const regUsername = /^[a-z0-9_-]{3,16}$/; 
            if ( !regUsername.test( username ) ) throw Error("You can make username by 3-15 characters, lower case, number, -, _");

            const exists = await prisma.$exists.user({ OR: [ {username}, {email} ] });
            if ( exists ) {
                throw Error("This username or email is already taken.")
            }
            await prisma.createUser({ username, email, fullname, bio });
            return true;
        }
    }
}