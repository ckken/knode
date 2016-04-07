"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
//全局 promise
global.Promise = require('bluebird');
var default_1 = (function () {
    function default_1() {
    }
    default_1.prototype.run = function (opt) {
        this.config = this.init_config(opt);
    };
    default_1.prototype.init_config = function (config) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(config);
        });
    };
    return default_1;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=index.js.map