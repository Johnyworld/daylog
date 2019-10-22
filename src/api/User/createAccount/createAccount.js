import { prisma } from "../../../../generated/prisma-client";

const defaultDoings = [
    { id: "ck20j0hcw005o0706xlzdpku7" },
    { id: "ck20kcnl700h40706qa1oauiv" },
    { id: "ck20kd84w00i30706yrd2vcn5" },
    { id: "ck20khx7h00jl070650xybss8" },
    { id: "ck20klwm100l80706amabxg05" },
    { id: "ck20knbbk00mt0706q29b0rr7" },
    { id: "ck20kssqv00t80706lm3wi0mb" }
]

export default {
    Mutation : {
        createAccount : async(_, args) => {
            const { username, email, fullname="", bio="", avatar="", lang } = args;

            const regUsername = /^[a-z0-9_-]{3,16}$/; 
            const regFullname = /^[^0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]{2,18}$/;
            const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

            if ( !regUsername.test( username ) ) throw Error("You can make username by 3-15 characters, lower case, number, -, _");
            if ( !regFullname.test( fullname ) ) throw Error("You can make fullname by 2-17 characters, only alphabets");
            if ( !regEmail.test( email ) ) throw Error("Email is not right");

            try {
                const exists = await prisma.$exists.user({ OR: [ {username}, {email} ] });
                if ( exists ) { throw Error("This username or email is already taken.") }

                
                const user = await prisma.createUser({ username, email, fullname, bio, lang, avatar });

                defaultDoings.forEach( async doing => {
                    await prisma.createPin({
                        user: { connect: { id: user.id }},
                        doing: { connect: { id: doing.id }}
                    })
                })

                return true;
            } catch {
                return false;
            }

            
        }
    }
}