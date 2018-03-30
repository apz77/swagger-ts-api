"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var MethodToTsGenerator = /** @class */ (function () {
    function MethodToTsGenerator(methodTemplate) {
        this.methodTemplate = methodTemplate || tsInterfacesStub_1.methodStub;
    }
    MethodToTsGenerator.prototype.generateMethod = function (method) {
        var result = this.methodTemplate.slice();
        var paramName = "request";
        var requestType = method.request && method.request.name;
        var resultType = (method.response && method.response.name) || "void";
        var methodParam = requestType ? paramName + ": " + requestType : "";
        // {{methodName}}
        result = result.replace(/{{methodName}}/g, method.name);
        //{{methodParam}}
        result = result.replace(/{{methodParam}}/g, methodParam);
        //{{methodResultType}}
        result = result.replace(/{{methodResultType}}/g, resultType);
        //{{url}}
        result = result.replace(/{{url}}/g, method.url);
        //{{dataName}}
        result = result.replace(/{{dataName}}/g, methodParam ? paramName : "null");
        //{{httpMethod}}
        result = result.replace(/{{httpMethod}}/g, method.method);
        return result;
    };
    return MethodToTsGenerator;
}());
exports.MethodToTsGenerator = MethodToTsGenerator;
//# sourceMappingURL=methodToTsGenerator.js.map