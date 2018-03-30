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
    function ModuleGenerator(interfaceGenerator, methodGenerator, methodTemplate, moduleTemplate) {
        this.interfaceGenerator = interfaceGenerator;
        this.methodGenerator = methodGenerator;
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
            methodResult = methodResult.replace(/{{requestInterface}}/g, !types_1.isEmptyModel(method.request) && method.request
                ? _this.interfaceGenerator.generate(method.request, allSchemas, newCtx) + '\n'
                : '');
            // {{requestInterface}}
            methodResult = methodResult.replace(/{{formInterface}}/g, !types_1.isEmptyModel(method.form) && method.form
                ? _this.interfaceGenerator.generate(method.form, allSchemas, newCtx) + '\n'
                : '');
            // {{responseInterface}}
            methodResult = methodResult.replace(/{{responseInterface}}/g, !types_1.isEmptyModel(method.response) && method.response && method.response !== 'link'
                ? _this.interfaceGenerator.generate(method.response, allSchemas, __assign({}, newCtx, { isResponse: true })) + '\n'
                : '');
            // {{requestMetadata}}
            methodResult = methodResult.replace(/{{requestMetadata}}/g, !types_1.isEmptyModel(method.request) && method.request
                ? _this.interfaceGenerator.generateMetadata(method.request, allSchemas, newCtx) + '\n'
                : '');
            // {{formMetadata}}
            methodResult = methodResult.replace(/{{formMetadata}}/g, method.form && !types_1.isEmptyModel(method.form)
                ? _this.interfaceGenerator.generateMetadata(method.form, allSchemas, newCtx) + '\n'
                : '');
            // {{responseMetadata}}
            methodResult = methodResult.replace(/{{responseMetadata}}/g, !types_1.isEmptyModel(method.response) && method.response && method.response !== 'link'
                ? _this.interfaceGenerator.generateMetadata(method.response, allSchemas, __assign({}, newCtx, { isResponse: true })) + '\n'
                : '');
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
    return ModuleGenerator;
}());
exports.ModuleGenerator = ModuleGenerator;
//# sourceMappingURL=moduleGenerator.js.map