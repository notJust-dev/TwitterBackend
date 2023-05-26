"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Generate a random 8 digit number as the email token
function generateEmailToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateAuthToken(tokenId) {
    const jwtPayload = { tokenId };
    return jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
}
// Create a user, if it doesn't exist,
// generate the emailToken and send it to their email
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // generate token
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);
    try {
        const createdToken = yield prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email },
                    },
                },
            },
        });
        console.log(createdToken);
        // TODO send emailToken to user's email
        yield (0, emailService_1.sendEmailToken)(email, emailToken);
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
}));
// Validate the emailToken
// Generate a long-lived JWT token
router.post('/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, emailToken } = req.body;
    const dbEmailToken = yield prisma.token.findUnique({
        where: {
            emailToken,
        },
        include: {
            user: true,
        },
    });
    if (!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
    }
    if (dbEmailToken.expiration < new Date()) {
        return res.status(401).json({ error: 'Token expired!' });
    }
    if (((_a = dbEmailToken === null || dbEmailToken === void 0 ? void 0 : dbEmailToken.user) === null || _a === void 0 ? void 0 : _a.email) !== email) {
        return res.sendStatus(401);
    }
    // Here we validated that the user is the owner of the email
    // generate an API token
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000);
    const apiToken = yield prisma.token.create({
        data: {
            type: 'API',
            expiration,
            user: {
                connect: {
                    email,
                },
            },
        },
    });
    // Invalidate the email
    yield prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false },
    });
    // generate the JWT token
    const authToken = generateAuthToken(apiToken.id);
    res.json({ authToken });
}));
exports.default = router;
