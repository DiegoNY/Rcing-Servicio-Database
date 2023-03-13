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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dbffile_1 = require("dbffile");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
/**INICIALIZANDO SERVICIO 🦧*/
const app = (0, express_1.default)();
exports.app = app;
/**CONFIG  */
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
/**PRUEBA DE MOCK 🍕 */
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const DOCUMENTOS_MOCK = [];
        const DOCS = yield dbffile_1.DBFFile.open(__filename + '/../mock/sunat_answer.dbf');
        try {
            for (var _d = true, DOCS_1 = __asyncValues(DOCS), DOCS_1_1; DOCS_1_1 = yield DOCS_1.next(), _a = DOCS_1_1.done, !_a;) {
                _c = DOCS_1_1.value;
                _d = false;
                try {
                    const docs = _c;
                    DOCUMENTOS_MOCK.push(docs);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = DOCS_1.return)) yield _b.call(DOCS_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.status(200).send(DOCUMENTOS_MOCK).json();
    }
    catch (error) {
        next(error);
    }
}));
app.post('/', (req, res) => {
    const data = req.body;
    res.send({
        error: false,
        cantidad: data.length,
        data: data
    });
});
