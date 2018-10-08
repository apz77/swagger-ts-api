"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var MethodGenerator = /** @class */ (function () {
    function MethodGenerator(methodTemplate, linkMethodTemplate) {
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
                ? method.request.map(function (schema) { return ctx.tag + "." + schema.name; }).join(' | ')
                : !types_1.isEmptyModel(method.request) ? ctx.tag + "." + method.request.name : null
            : null;
        var requestMetadata = method.request
            ? Array.isArray(method.request)
                ? null
                : !types_1.isEmptyModel(method.request) ? method.request.name + "Metadata" : null
            : null;
        var requestMetadatas = method.request && requestType
            ? this.getRequestMetadatas(method.request)
            : null;
        var url = requestType && method.url.includes('{')
            ? this.apiPrefix + "setParams(" + this.apiPrefix + "API_URL + '" + method.url + "', " + paramName + ", " + requestMetadata + ")"
            : this.apiPrefix + "API_URL + '" + method.url + "'";
        var paramsArray = [];
        var headerParams = '';
        if (requestType) {
            paramsArray.push(paramName + ": " + requestType);
            headerParams = paramName;
        }
        if (method.response && method.response === 'link') {
            var methodParam = paramsArray.join(', ');
            result = this.linkMethodTemplate.slice();
            // {{methodName}}
            result = result.replace(/{{methodName}}/g, method.name);
            // {{methodParam}}
            result = result.replace(/{{methodParam}}/g, methodParam);
            // {{headersParams}}
            result = result.replace(/{{headersParams}}/g, headerParams);
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
                    ? method.response.map(function (schema) { return ctx.tag + '.' + schema.name; }).join(' | ')
                    : (!types_1.isEmptyModel(method.response) && method.response && (ctx.tag + '.' + method.response.name)) || 'void'
                : 'void';
            var methodFormType = '';
            if (method.form && !types_1.isEmptyModel(method.form)) {
                methodFormType = method.form.name;
                paramsArray.push(paramFormName + ": " + ctx.tag + "." + methodFormType);
            }
            var methodParam = paramsArray.join(', ');
            // {{methodName}}
            result = result.replace(/{{apiPrefix}}/g, this.apiPrefix);
            // {{methodName}}
            result = result.replace(/{{methodName}}/g, method.name);
            // {{methodParam}}
            result = result.replace(/{{methodParam}}/g, methodParam);
            // {{methodResultType}}
            result = result.replace(/{{methodResultType}}/g, resultType);
            // {{headersParams}}
            result = result.replace(/{{headersParams}}/g, headerParams);
            // {{url}}
            result = result.replace(/{{url}}/g, url);
            // {{formPrepare}}
            var formPrepare = methodFormType
                ? 'const formData = new FormData();\n' +
                    ("for (const key in " + paramFormName + ") {\n") +
                    ("  formData.append(key, (" + paramFormName + " as {[key: string]: any})[key]);\n") +
                    '}\n'
                : '';
            if (formPrepare) {
                formPrepare = formPrepare.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(ctx.tabs + 1) + item; }).join('\n');
            }
            result = result.replace(/{{formPrepare}}/g, formPrepare);
            if (formPrepare) {
                result = result.replace(/{{formData}}/g, 'formData');
            }
            else {
                result = result.replace(/{{formData}}/g, 'null');
            }
            var hasBody = Array.isArray(method.request)
                || (method.request !== null
                    && Object.keys(method.request.properties)
                        .find(function (requestParamName) { return !method.url.includes("{" + requestParamName + "}"); }));
            // {{body}}
            result = result.replace(/{{body}}/g, requestType && method.method !== 'get' && !!hasBody
                ? this.apiPrefix + "serialize(" + paramName + ", " + requestMetadatas + ")"
                : 'null');
            // {{contentType}}
            result = result.replace(/{{contentType}}/g, methodFormType ? 'application/json' : 'multipart/mixed');
            // {{httpMethod}}
            result = result.replace(/{{httpMethod}}/g, method.method);
            // {{typeCheckCode}}
            result = result.replace(/{{responseTypeCheckFunction}}/g, this.generateTypeCheck(method.response, ctx.tag));
            // {{comment}}
            result = result.replace(/{{comment}}/g, "/**\n  " + method.summary + "\n  " + method.description + "\n */\n");
        }
        if (ctx.tabs) {
            result = result.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(ctx.tabs) + item; }).join('\n');
        }
        return result;
    };
    MethodGenerator.prototype.generateTypeCheck = function (schema, tag) {
        var schemas = Array.isArray(schema) ? schema : [schema];
        if (schemas.length === 0 || (schemas.length === 1 && types_1.isEmptyModel(schemas[0]))) {
            return 'null';
        }
        return '[' + schemas.map(function (schema) {
            return tag + ".is" + schema.name;
        }).join(', ') + ']';
    };
    MethodGenerator.prototype.getRequestMetadatas = function (schema) {
        var schemas = Array.isArray(schema) ? schema : [schema];
        return "[" + schemas.map(function (schema) { return schema.name + 'Metadata'; }).join(', ') + "]";
    };
    return MethodGenerator;
}());
exports.MethodGenerator = MethodGenerator;
//# sourceMappingURL=methodGenerator.js.map