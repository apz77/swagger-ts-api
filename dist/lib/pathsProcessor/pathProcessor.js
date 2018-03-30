"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathProcessor = /** @class */ (function () {
    function PathProcessor(schemaFactory) {
        this.schemaFactory = schemaFactory;
    }
    PathProcessor.prototype.translatePath = function (methodUrl, method, swaggerMethod, ctx) {
        var tag = swaggerMethod.tags && swaggerMethod.tags[0];
        var name = swaggerMethod['x-metadata'] && swaggerMethod['x-metadata'].method;
        if (!tag) {
            console.error("Method " + method + " " + methodUrl + " has to tags");
            tag = 'NoTags';
            ctx.hasErrors = true;
        }
        if (!name) {
            console.error("Method " + method + " " + methodUrl + " has to x-metadata.method");
            name = 'NoMethod';
            ctx.hasErrors = true;
        }
        var capitalizedName = name.charAt(0).toLocaleUpperCase() + name.slice(1);
        var requestSchema = null;
        var requestForm = null;
        if (!swaggerMethod.requestBody ||
            !swaggerMethod.requestBody.content) {
            console.warn("Method " + method + " " + methodUrl + " has no request body schema");
        }
        else {
            // Because of BUG in TypeScript
            var appjson = swaggerMethod.requestBody.content['application/json'];
            var form = swaggerMethod.requestBody.content['multipart/mixed'];
            if ((!appjson || !appjson.schema) && (!form || !form.schema)) {
                console.warn("Method " + method + " " + methodUrl + " has no request body schema");
            }
            else {
                if (appjson && appjson.schema) {
                    requestSchema = this.schemaFactory.translateSchema("" + tag + capitalizedName + "Request", appjson.schema, ctx);
                }
                if (form && form.schema) {
                    requestForm = this.schemaFactory.translateSchema("" + tag + capitalizedName + "Form", form.schema, ctx);
                }
            }
        }
        var responseSchema = null;
        if (!swaggerMethod.responses) {
            console.warn("Method " + method + " " + methodUrl + " has no response");
        }
        else {
            // Because of bug in TypeScript
            var r200 = swaggerMethod.responses['200'];
            if (!r200 || !r200.content) {
                console.warn("Method " + method + " " + methodUrl + " has no 200 response");
            }
            else {
                // Because of bug in TypeScript
                var appjson = r200.content['application/json'];
                if (!appjson || !appjson.schema) {
                    if (r200.content['image/jpeg'] || r200.content['image/png'] || r200.content['*/*']) {
                        responseSchema = 'link';
                    }
                    else {
                        console.warn("Method " + method + " " + methodUrl + " has no 200 response schema");
                    }
                }
                else {
                    responseSchema = this.schemaFactory.translateSchema("" + tag + capitalizedName + "Response", appjson.schema, ctx);
                }
            }
        }
        return {
            name: name,
            tag: tag,
            method: method,
            url: methodUrl,
            description: swaggerMethod.description || '',
            summary: swaggerMethod.summary || '',
            request: requestSchema,
            form: requestForm,
            response: responseSchema,
        };
    };
    return PathProcessor;
}());
exports.PathProcessor = PathProcessor;
//# sourceMappingURL=pathProcessor.js.map