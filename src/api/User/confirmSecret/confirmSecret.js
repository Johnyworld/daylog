import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
    Mutation : {
        confirmSecret: async(_, args) => {
            const { secret, email } = args;
            const user = await prisma.user({ email });
            const converted = secret.trim().toUpperCase();

            if ( user.loginSecret === converted ) {
                await prisma.updateUser({ 
                    where: { id: user.id },
                    data: { loginSecret: "" }
                });
                return generateToken(user.id);
            } else {
                throw Error("Wrong email and secret combination")
            }
        }
    }
}