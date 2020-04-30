"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extra_1 = require("@mx-space/extra");
const express_1 = require("express");
exports.musicRouter = express_1.Router();
exports.musicRouter.get('/music', async (req, res) => {
    const { NETEASE_PHONE, NETEASE_PASSWORD } = process.env;
    if (typeof NETEASE_PASSWORD !== 'string' &&
        typeof NETEASE_PHONE !== 'string') {
        return res.status(422).send({
            message: '请先填写网易云登录信息',
        });
    }
    const client = new extra_1.NeteaseMusic(NETEASE_PHONE, NETEASE_PASSWORD);
    await client.Login();
    const weekdata = await client.getWeekData();
    const alldata = await client.getAllData();
    const playlist = await client.getFavorite();
    const uid = client.user.id;
    res.send({
        weekdata,
        alldata,
        playlist,
        uid,
    });
});
exports.musicRouter.get('/song', async (req, res) => {
    const id = parseInt(req.query.id);
    if (!id || isNaN(id)) {
        return res.status(422).send({
            message: 'id 必须为数字',
        });
    }
    const { NETEASE_PHONE, NETEASE_PASSWORD } = process.env;
    if (typeof NETEASE_PASSWORD !== 'string' &&
        typeof NETEASE_PHONE !== 'string') {
        return res.status(422).send({
            message: '请先填写网易云登录信息',
        });
    }
    const client = new extra_1.NeteaseMusic(NETEASE_PHONE, NETEASE_PASSWORD);
    return await client.getMusicUrl(id);
});
