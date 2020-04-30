"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./music"));
__export(require("./bili"));
const music_1 = require("./music");
const bili_1 = require("./bili");
const express_1 = require("express");
exports.router = express_1.Router();
exports.router.use(music_1.musicRouter);
exports.router.use(bili_1.biliRouter);
