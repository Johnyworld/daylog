import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        editUser: async(_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, username, fullname, bio, lang } = args;
            const { user } = request;

            const regUsername = /^[a-z0-9_-]{3,16}$/; 
            const regFullname = /^[^0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{2,18}$/;

            if ( !regUsername.test( username ) ) throw Error("You can make username by 3-15 characters, lower case, number, -, _");
            if ( !regFullname.test( fullname ) ) throw Error("You can make fullname by 2-17 characters, only alphabets");

            if ( id === user.id ) {
                await prisma.updateUser({
                    where: { id: user.id },
                    data : { username, fullname, bio, lang }
                }) 
                return true;
            } else {
                throw Error("It is not me.");
            }
        }
    }
}