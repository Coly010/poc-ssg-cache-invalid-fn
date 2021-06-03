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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var path = require("path");
(function (schema) {
    return __awaiter(this, void 0, void 0, function () {
        var compilerConfig, pagesInFs, pages, _i, pages_1, page, pageName, unrenderedPage, incompleteBootstrapScript, bootstrapScript, indexFile, indexOfClosingBodyTag, firstPartOfFile, secondPartOfFile, newIndexFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require(schema.appRoot + '/config.js'); })];
                case 1:
                    compilerConfig = _a.sent();
                    pagesInFs = {};
                    return [4 /*yield*/, fs_1.promises.readdir(compilerConfig.pages)];
                case 2:
                    pages = _a.sent();
                    _i = 0, pages_1 = pages;
                    _a.label = 3;
                case 3:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 6];
                    page = pages_1[_i];
                    pageName = page.split('.').slice(0, -1).join('.');
                    return [4 /*yield*/, Promise.resolve().then(function () { return require(compilerConfig.pages + "/" + page); })];
                case 4:
                    unrenderedPage = _a.sent();
                    pagesInFs[pageName] = unrenderedPage();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    incompleteBootstrapScript = fs_1.promises.readFile(path.join(__dirname, '/lib/bootstrap.js'));
                    bootstrapScript = "\n  <script>\n    const bootstrapPage = '" + compilerConfig.bootstrapPage + "';\n    const domEntryPointId = '" + compilerConfig.domEntryPointId + "';\n    const unmassagedPages = " + listOutPages(pagesInFs) + "\n\n    " + incompleteBootstrapScript + "\n\n  </script>";
                    return [4 /*yield*/, fs_1.promises.readFile(compilerConfig.publicIndex)];
                case 7:
                    indexFile = _a.sent();
                    indexOfClosingBodyTag = indexFile.indexOf('</body>');
                    firstPartOfFile = indexFile.slice(0, indexOfClosingBodyTag - 1);
                    secondPartOfFile = indexFile.slice(indexOfClosingBodyTag);
                    newIndexFile = "" + firstPartOfFile + bootstrapScript + secondPartOfFile;
                    return [4 /*yield*/, fs_1.promises.writeFile('/dist/apps/poc-example/index.html', newIndexFile)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})({ appRoot: '../../../apps/poc-example' });
function listOutPages(pages) {
    var pageStr = 'const pages = {';
    for (var _i = 0, _a = Object.entries(pages); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], _c = _b[1], unrenderedHtml = _c[0], data = _c[1];
        pageStr += name_1 + ": [" + unrenderedHtml + ", " + JSON.stringify(data) + "]";
    }
    pageStr += '};';
    return pageStr;
}
