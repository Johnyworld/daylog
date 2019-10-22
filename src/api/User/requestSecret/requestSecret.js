import { generateSecret, sendSecretMail } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

const getWords = ({ lang }) => {
    if ( lang === 'kr' ) {
        return {
            subject : "님. 데이로그 로그인 인증 메일입니다. 🔒",
            greeting : "안녕하세요",
            sir : "님.",
            mailContent : "아래의 코드를 복사하여 Daylog 로그인 화면에 붙여넣으세요."
        }
    } else {
        return {
            subject : ". Login secret for Daylog. 🔒",
            greeting : "Dear",
            sir : ".",
            mailContent : "Copy and paste your login secret!<br/>Your login secret is..."
        }
    }
}

const getHtml = ({ username, loginSecret, words }) => {
    return `
        <img src="https://daylog.s3.ap-northeast-2.amazonaws.com/logo_pos.png"
            width="164"
            height="40"
            style="
                display: block;
                margin: 15px 0;
            "
        >
        <p style="
            font-size:16px;
            padding-top: 15px;
            border-top: 1px solid #edf1f5;
        ">
            ${words.greeting} <strong>${username}</strong>${words.sir}
            <br/>
            ${words.mailContent}
        </p><br/>
        <strong style="
            background-color:#1a9df9; 
            color: white; 
            font-size:32px; 
            padding: 5px 10px;"
        >${loginSecret}</strong>
    `;
}

export default {
    Mutation : {
        requestSecret : async(_, args) => {
            const { email } = args;
            const loginSecret = generateSecret();
            
            try {
                const user = await prisma.user({ email });
                const { username, lang } = user;

                const words = getWords({ lang });
                const subject = `${words.greeting} ${username}${words.subject}`;
                const html = getHtml({ username, loginSecret, words });

                await prisma.updateUser({ where: { email }, data: { loginSecret }});
                sendSecretMail({ to: email, subject, html });
                return true;
            } catch {
                return false;
            }
        }
    }
}