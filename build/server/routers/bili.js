"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extra_1 = require("@mx-space/extra");
const express_1 = require("express");
exports.biliRouter = express_1.Router();
const axios_1 = __importDefault(require("axios"));
exports.biliRouter.get('/bangumi', async (req, res) => {
    const { uid, len = 30 } = req.query;
    if (!uid || isNaN(uid)) {
        return res.status(422).send({
            message: 'uid 必须为数字',
        });
    }
    if (isNaN(len)) {
        return res.status(422).send({
            message: 'len 必须为数字',
        });
    }
    const client = new extra_1.BiliClient(parseInt(uid));
    const bangumi = await client.getFavoriteBangumi(parseInt(len));
    res.send({
        data: bangumi,
    });
});
exports.biliRouter.get('/video', async (req, res) => {
    const { uid, len = 30 } = req.query;
    if (!uid || isNaN(uid)) {
        return res.status(422).send({
            message: 'uid 必须为数字',
        });
    }
    if (isNaN(len)) {
        return res.status(422).send({
            message: 'len 必须为数字',
        });
    }
    const client = new extra_1.BiliClient(parseInt(uid));
    const data = await client.getPersonalVideo(parseInt(len));
    res.send({
        data,
    });
});
exports.biliRouter.get('/cover', async (req, res) => {
    const { src } = req.query;
    if (!src) {
        return res.send();
    }
    const $api = axios_1.default.create();
    $api
        .get(src, { responseType: 'arraybuffer' })
        .then((response) => Buffer.from(response.data, 'binary'))
        .then((buffer) => {
        res.send(buffer);
    });
});
