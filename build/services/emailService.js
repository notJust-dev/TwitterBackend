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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToken = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const console_1 = require("console");
require('dotenv').config();
const ses = new client_ses_1.SESClient({});
function createSendEmailCommand(toAddress, fromAddress, message) {
    return new client_ses_1.SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: 'Your one-time password',
            },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: message,
                },
            },
        },
    });
}
function sendEmailToken(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('email: ', email, token);
        const message = `Your one time password: ${token}`;
        const command = createSendEmailCommand(email, 'savinvadim1312@gmail.com', message);
        try {
            return yield ses.send(command);
        }
        catch (e) {
            console.log('Error sending email', e);
            return console_1.error;
        }
    });
}
exports.sendEmailToken = sendEmailToken;
