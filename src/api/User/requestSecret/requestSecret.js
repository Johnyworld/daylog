import { generateSecret, sendSecretMail } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        requestSecret : async(_, args) => {
            const { email } = args;
            const loginSecret = generateSecret();
            try {
                const user = await prisma.user({ email });
                const { username, lang } = user;
                await prisma.updateUser({ where: { email }, data: { loginSecret }});
                sendSecretMail(email, loginSecret, username, lang);
                return true;
            } catch {
                return false;
            }
        }
    }
}