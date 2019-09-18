import { generateSecret } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation : {
        requestSecret : async(_, args) => {
            const { email } = args;
            const loginSecret = generateSecret();
            try {
                await prisma.updateUser({ where: { email }, data: { loginSecret }});
                return true;
            } catch {
                return false;
            }
        }
    }
}