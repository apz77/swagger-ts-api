"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var MethodGenerator = /** @class */ (function () {
    function MethodGenerator(methodTemplate, linkMethodTemplate) {
        this.typeCheckCode = tsInterfacesStub_1.typeCheckCode;
        this.apiPrefix = 'Api.';
        this.methodTemplate = methodTemplate || tsInterfacesStub_1.methodStub;
        this.linkMethodTemplate = linkMethodTemplate || tsInterfacesStub_1.linkMethodStub;
    }
    MethodGenerator.prototype.generateMethod = function (method, ctx) {
        var result = '';
        var paramName = 'request';
        var paramFormName = 'form';
        var requestType = method.request
            ? Array.isArray(method.request)
                ? method.request.map(function (schema) { return schema.name; }).join(' | ')
                : !types_1.isEmptyModel(method.request) ? method.request.name : null
            : null;
        var url = requestType && method.url.includes('{')
            ? this.apiPrefix + "setParams(" + this.apiPrefix + "API_URL + '" + method.url + "', " + paramName + ", " + requestType + "Metadata)"
            : this.apiPrefix + "API_URL + '" + method.url + "'";
        var paramsArray = [];
        if (requestType) {
            paramsArray.push(paramName + ": " + requestType);
        }
        if (method.response && method.response === 'link') {
            var methodParam = paramsArray.join(', ');
            result = this.linkMethodTemplate.slice();
            // {{methodName}}
            result = result.replace(/{{methodName}}/g, method.name);
            // {{methodParam}}
            result = result.replace(/{{methodParam}}/g, methodParam);
            // {{url}}
            result = result.replace(/{{url}}/g, url);
            // {{contentType}}
            result = result.replace(/{{contentType}}/g, 'application/json');
            // {{comment}}
            result = result.replace(/{{comment}}/g, "/**\n  " + method.summary + "\n  " + method.description + "\n */\n");
        }
        else {
            result = this.methodTemplate.slice();
            var resultType = method.response
                ? Array.isArray(method.response)
                    ? method.response.map(function (schema) { return schema.name; }).join(' | ')
                    : (!types_1.isEmptyModel(method.response) && method.response && method.response.name) || 'void'
                : 'void';
            var methodFormType = '';
            if (method.form && !types_1.isEmptyModel(method.form)) {
                methodFormType = method.form.name;
                paramsArray.push(paramFormName + ": " + methodFormType);
            }
            var methodParam = paramsArray.join(', ');
            // {{methodName}}
            result = result.replace(/{{methodName}}/g, method.name);
            // {{methodParam}}
            result = result.replace(/{{methodParam}}/g, methodParam);
            // {{methodResultType}}
            result = result.replace(/{{methodResultType}}/g, resultType);
            // {{url}}
            result = result.replace(/{{url}}/g, url);
            // {{formPrepare}}
            var formPrepare = methodFormType
                ? 'const formData = new FormData();\n' +
                    ("for (const key in " + paramFormName + ") {\n") +
                    ("  formData.append(key, (" + paramFormName + " as {[key: string]: any})[key]);\n") +
                    '}\n'
                : '';
            if (ctx.tabs && formPrepare) {
                formPrepare = formPrepare.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(ctx.tabs) + item; }).join('\n');
            }
            result = result.replace(/{{formPrepare}}/g, formPrepare);
            // {{body}}
            result = result.replace(/{{body}}/g, methodFormType
                ? 'formData'
                : requestType ? this.apiPrefix + "serialize(" + paramName + ")" : 'null');
            // {{contentType}}
            result = result.replace(/{{contentType}}/g, methodFormType ? 'application/json' : 'multipart/mixed');
            // {{httpMethod}}
            result = result.replace(/{{httpMethod}}/g, method.method);
            // {{typeCheckCode}}
            result = result.replace(/{{typeCheckCode}}/g, this.generateTypeCheck(method.response));
            // {{comment}}
            result = result.replace(/{{comment}}/g, "/**\n  " + method.summary + "\n  " + method.description + "\n */\n");
        }
        if (ctx.tabs) {
            result = result.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(ctx.tabs) + item; }).join('\n');
        }
        return result;
    };
    MethodGenerator.prototype.generateTypeCheck = function (schema) {
        var schemas = Array.isArray(schema) ? schema : [schema];
        if (schemas.length === 0 || (schemas.length === 1 && types_1.isEmptyModel(schemas[0]))) {
            return ';';
        }
        return this.typeCheckCode.replace(/{{responseTypeCheckFunction}}/g, schemas
            .map(function (schema) {
            return "is" + schema.name + "(decodedResponse)";
        }).join(' || '));
    };
    return MethodGenerator;
}());
exports.MethodGenerator = MethodGenerator;
//# sourceMappingURL=methodGenerator.js.map