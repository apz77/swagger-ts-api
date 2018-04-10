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
var types_1 = require("../types");
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var ModuleGenerator = /** @class */ (function () {
    function ModuleGenerator(interfaceGenerator, methodGenerator, typeCheckGenerator, methodTemplate, moduleTemplate) {
        this.interfaceGenerator = interfaceGenerator;
        this.methodGenerator = methodGenerator;
        this.typeCheckGenerator = typeCheckGenerator;
        this.methodTemplate = methodTemplate || tsInterfacesStub_1.defaultModuleMethodTemplate;
        this.moduleTemplate = moduleTemplate || tsInterfacesStub_1.defaultModuleTemplate;
    }
    ModuleGenerator.prototype.generate = function (moduleName, methods, allSchemas, ctx) {
        var _this = this;
        var result = this.moduleTemplate.slice();
        var tabs = typeof ctx.tabs === 'number' ? ctx.tabs : 0;
        var allMethods = methods.map(function (method) {
            var methodResult = _this.methodTemplate.slice();
            var newCtx = __assign({}, ctx, { isResponse: false, tabs: tabs + 1 });
            // {{method}}
            methodResult = methodResult.replace(/{{method}}/g, _this.methodGenerator.generateMethod(method, newCtx) + '\n');
            // {{requestInterface}}
            methodResult = methodResult.replace(/{{requestInterface}}/g, _this.generateSchemasAndTypecheck(method.request, allSchemas, newCtx));
            // {{requestInterface}}
            methodResult = methodResult.replace(/{{formInterface}}/g, !types_1.isEmptyModel(method.form) && method.form
                ? _this.interfaceGenerator.generate(method.form, allSchemas, newCtx) + '\n\n' +
                    _this.typeCheckGenerator.generate(method.form, newCtx) + '\n'
                : '');
            // {{responseInterface}}
            methodResult = methodResult.replace(/{{responseInterface}}/g, _this.generateSchemasAndTypecheck(method.response, allSchemas, __assign({}, newCtx, { isResponse: true })));
            // {{requestMetadata}}
            methodResult = methodResult.replace(/{{requestMetadata}}/g, _this.generateSchemasMetadata(method.request, allSchemas, newCtx));
            // {{formMetadata}}
            methodResult = methodResult.replace(/{{formMetadata}}/g, method.form && !types_1.isEmptyModel(method.form)
                ? _this.interfaceGenerator.generateMetadata(method.form, allSchemas, newCtx) + '\n'
                : '');
            // {{responseMetadata}}
            methodResult = methodResult.replace(/{{responseMetadata}}/g, _this.generateSchemasMetadata(method.response, allSchemas, __assign({}, newCtx, { isResponse: true })));
            ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;
            return methodResult;
        }).join('\n');
        result = result.replace(/{{ModuleName}}/g, moduleName);
        // {{allMethods}}
        result = result.replace(/{{allMethods}}/g, allMethods);
        if (tabs) {
            result = result.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(tabs) + item; }).join('\n');
        }
        return result;
    };
    ModuleGenerator.prototype.generateSchemasAndTypecheck = function (schema, allSchemas, ctx) {
        var _this = this;
        var schemas = Array.isArray(schema) ? schema : [schema];
        return schemas
            .filter(function (schema) { return !!schema && schema !== 'link'; })
            .map(function (schema) {
            return !types_1.isEmptyModel(schema) && schema
                ? _this.interfaceGenerator.generate(schema, allSchemas, ctx) + '\n\n' +
                    _this.typeCheckGenerator.generate(schema, ctx) + '\n'
                : '';
        }).join('\n');
    };
    ModuleGenerator.prototype.generateSchemasMetadata = function (schema, allSchemas, ctx) {
        var _this = this;
        var schemas = Array.isArray(schema) ? schema : [schema];
        return schemas
            .filter(function (schema) { return !!schema && schema !== 'link'; })
            .map(function (schema) {
            return !types_1.isEmptyModel(schema)
                ? _this.interfaceGenerator.generateMetadata(schema, allSchemas, ctx)
                : '';
        }).join('\n');
    };
    return ModuleGenerator;
}());
exports.ModuleGenerator = ModuleGenerator;
//# sourceMappingURL=moduleGenerator.js.map