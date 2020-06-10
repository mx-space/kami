"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
__exportStar(require("./music"), exports);
__exportStar(require("./bili"), exports);
const music_1 = require("./music");
const bili_1 = require("./bili");
const express_1 = require("express");
exports.router = express_1.Router();
exports.router.use(music_1.musicRouter);
exports.router.use(bili_1.biliRouter);
