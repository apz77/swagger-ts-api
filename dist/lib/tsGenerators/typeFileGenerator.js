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
var TypeFileGenerator = /** @class */ (function () {
    function TypeFileGenerator(moduleGenerator, interfaceGenerator, typeCheckGenerator, indexFileGenerator) {
        this.moduleGenerator = moduleGenerator;
        this.interfaceGenerator = interfaceGenerator;
        this.typeCheckGenerator = typeCheckGenerator;
        this.indexFileGenerator = indexFileGenerator;
        this.typesTemplate = tsInterfacesStub_1.defaultTypeFileTemplate;
    }
    TypeFileGenerator.prototype.getFileName = function (tag) {
        return tag.charAt(0).toLocaleLowerCase() + tag.slice(1);
    };
    TypeFileGenerator.prototype.generate = function (paths, schemas, tag, ctx) {
        var _this = this;
        var result = this.typesTemplate.slice();
        var interfaces = '';
        var newCtx = __assign({}, ctx, { usedTypes: {}, isResponse: false, tabs: 0 });
        var schemaName = Object.keys(schemas).find(function (schema) { return schema.toLowerCase() === tag.toLowerCase(); });
        if (schemaName && schemas[schemaName]) {
            interfaces +=
                this.interfaceGenerator.generate(schemas[schemaName], schemas, newCtx) + '\n\n' +
                    this.typeCheckGenerator.generate(schemas[schemaName], newCtx) + '\n\n';
        }
        var pathName = Object.keys(paths).find(function (paths) { return paths.toLowerCase() === tag.toLowerCase(); });
        if (pathName && paths[pathName]) {
            paths[pathName].map(function (method) {
                interfaces += _this.moduleGenerator.generateMethodTypes(method, schemas, newCtx);
            });
        }
        // {{interface}}
        result = result.replace(/{{interface}}/g, interfaces);
        // {{imports}}
        var usedTypes = Object.keys(newCtx.usedTypes).filter(function (type) { return type !== tag; });
        result = result.replace(/{{imports}}/g, usedTypes.map(function (type) { return "import { " + type + " } from './" + _this.getFileName(type) + "';"; }).join('\n'));
        // {{indexImport}}
        result = result.replace(/{{indexImport}}/g, "import * as Api from './" + this.indexFileGenerator.getIndexFileName() + "';");
        return result;
    };
    return TypeFileGenerator;
}());
exports.TypeFileGenerator = TypeFileGenerator;
//# sourceMappingURL=typeFileGenerator.js.map