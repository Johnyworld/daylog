import "./env";
import { GraphQLServer } from 'graphql-yoga';
import logger from 'morgan';
import schema from './schema';
import './passport';
import { authenticateJwt } from "./passport";
import { isAuthenticated } from './middleware';
import multer from 'multer';
import s3Storage from 'multer-sharp-s3';
import aws from 'aws-sdk';
import { prisma } from "../generated/prisma-client";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({ schema, context: ({ request }) => ({ request, isAuthenticated }) });

server.express.use(logger("dev"));
server.express.use(authenticateJwt);

server.start({ port:PORT }, () =>
    console.log(`✅GraphQL Server running on http://localhost:${PORT}`)
);

// 아래는 업로드 이미지 컨트롤러입니다.
const s3 = new aws.S3({
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    accessKeyId: process.env.AWS_KEY,
    region: "ap-northeast-2"
})

// 프로필 업로드
const upload = multer({
    storage: s3Storage({
        s3,
        Bucket: "daylog/avatar",
        ACL: "public-read",
        resize: {
            width: 160,
            height: 160
        },
        rotate: true,
        max: true
    }),
    limits: { fileSize: 5000000 }
});

server.express.post('/upload', upload.single('avatar'), async(req, res) => {
    const file = req.file;
    const id = req.body.userId;
    try {
        await prisma.updateUser({ where: { id }, data: { avatar: file.Location } });
        return res.json(file);
    } catch {
        console.log("❌Fail to update user by prisma");
    }
});

// 아이콘 업로드
const iconUpload = multer({
    storage: s3Storage({
        s3,
        Bucket: "daylog/icon",
        ACL: "public-read",
        resize: {
            width: 48,
            height: 48
        },
        rotate: true,
        max: true
    }),
    limits: { fileSize: 1000000 }
}); 

server.express.post('/upload-icon', iconUpload.single('iconFile'), async(req, res) => {
    const file = req.file;
    return res.json(file);
});