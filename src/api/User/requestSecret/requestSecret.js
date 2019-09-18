import { generateSecret, sendSecretMail } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        requestSecret : async(_, args) => {
            const { email } = args;
            const loginSecret = generateSecret();
            const user = await prisma.user({ email });
            const { username, lang } = user;
            try {
                await prisma.updateUser({ where: { email }, data: { loginSecret }});
                await sendSecretMail(email, loginSecret, username, lang);
                return true;
            } catch {
                return false;
            }
        }
    }
}