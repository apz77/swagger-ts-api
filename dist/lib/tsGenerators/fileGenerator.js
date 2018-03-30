"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var FileGenerator = /** @class */ (function () {
    function FileGenerator(moduleGenerator, interfaceGenerator) {
        this.moduleGenerator = moduleGenerator;
        this.interfaceGenerator = interfaceGenerator;
        this.fileTemplate = tsInterfacesStub_1.defaultFileTemplate;
        this.indexTemplate = tsInterfacesStub_1.defaultIndexTemplate;
    }
    FileGenerator.prototype.generateIndex = function (schemas, tags) {
        var _this = this;
        var result = this.indexTemplate.slice();
        result = result.replace(/{{files}}/g, tags.map(function (tag) { return "export * from '" + _this.getFileName(tag) + "';"; }).join('\n'));
        result = result.replace(/{{commonTypes}}/g, this.interfaceGenerator.generateModelTypes(schemas));
        return result;
    };
    FileGenerator.prototype.getIndexFileName = function () {
        return 'api';
    };
    FileGenerator.prototype.getFileName = function (tag) {
        return tag.charAt(0).toLocaleLowerCase() + tag.slice(1);
    };
    FileGenerator.prototype.generate = function (paths, schemas, tag, ctx) {
        var result = this.fileTemplate.slice();
        var interfaceAndMetadata = '';
        var moduleContent = '';
        var newCtx = __assign({}, ctx, { isResponse: false, tabs: 0 });
        if (schemas[tag]) {
            interfaceAndMetadata = this.interfaceGenerator.generate(schemas[tag], schemas, newCtx) + '\n' +
                this.interfaceGenerator.generateMetadata(schemas[tag], schemas, newCtx) + '\n';
        }
        // {{interface}}
        result = result.replace(/{{interface}}/g, interfaceAndMetadata);
        if (paths[tag]) {
            moduleContent = this.moduleGenerator.generate(tag, paths[tag], schemas, newCtx);
        }
        // {{module}}
        result = result.replace(/{{module}}/g, moduleContent);
        return result;
    };
    return FileGenerator;
}());
exports.FileGenerator = FileGenerator;
//# sourceMappingURL=fileGenerator.js.map