"use strict";
/*
 * @Author: Innei
 * @Date: 2020-04-29 17:27:02
 * @LastEditTime: 2020-05-23 09:38:55
 * @LastEditors: Innei
 * @FilePath: /mx-web/server/routers/music.ts
 * @MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicRouter = void 0;
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
    if (!id) {
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
