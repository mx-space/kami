"use strict";
/*
 * @Author: Innei
 * @Date: 2020-04-30 11:04:43
 * @LastEditTime: 2020-07-14 21:04:47
 * @LastEditors: Innei
 * @FilePath: /mx-web/server/index.ts
 * @Coding with Love
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const routers_1 = require("./routers");
const cors_1 = __importDefault(require("cors"));
const apicache_1 = __importDefault(require("apicache"));
const redis_1 = __importDefault(require("redis"));
const port = parseInt(process.env.PORT || '2323', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({ dev });
const handle = (req, res) => app.getRequestHandler()(req, res);
// @ts-ignore
const REDIS = Boolean(~~process.env.REDIS || 0);
app
    .prepare()
    .then(() => {
    const server = express_1.default();
    const cache = process.env.NODE_ENV === 'production'
        ? REDIS
            ? apicache_1.default.options({ redisClient: redis_1.default.createClient() }).middleware
            : apicache_1.default.middleware
        : () => (req, res, next) => next();
    if (process.env.NODE_ENV === 'development') {
        server.use(cors_1.default());
    }
    server.use('/_extra', cache('120 minutes'), routers_1.router);
    server.get('/feed', cache('120 minutes'), handle);
    server.get('/atom.xml', cache('120 minutes'), handle);
    server.get('*', handle);
    server.listen(port, (err) => {
        if (err)
            throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
})
    .catch((e) => {
    if (dev) {
        console.error(e);
    }
    else {
        console.log(e.message);
    }
});
