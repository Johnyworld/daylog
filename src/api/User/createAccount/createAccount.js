import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        createAccount : async(_, args) => {
            const { username, email, fullname="", bio="", lang } = args;

            const regUsername = /^[a-z0-9_-]{3,16}$/; 
            const regFullname = /^[^0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{2,18}$/;
            const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

            if ( !regUsername.test( username ) ) throw Error("You can make username by 3-15 characters, lower case, number, -, _");
            if ( !regFullname.test( fullname ) ) throw Error("You can make fullname by 2-17 characters, only alphabets");
            if ( !regEmail.test( email ) ) throw Error("Email is not right");

            const exists = await prisma.$exists.user({ OR: [ {username}, {email} ] });
            if ( exists ) {
                throw Error("This username or email is already taken.")
            }

            await prisma.createUser({ username, email, fullname, bio, lang });
            return true;
        }
    }
}