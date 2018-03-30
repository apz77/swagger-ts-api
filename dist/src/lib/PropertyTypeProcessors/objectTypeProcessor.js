"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var schema_1 = require("../schema");
var ObjectTypeProcessor = /** @class */ (function () {
    function ObjectTypeProcessor() {
    }
    ObjectTypeProcessor.prototype.consume = function (swaggerSchemaProperty, typeName, ctx) {
        if (typeName === "object") {
            if (swaggerSchemaProperty.properties && Object(swaggerSchemaProperty.properties) === swaggerSchemaProperty.properties) {
                var properties = {};
                for (var propertyName in swaggerSchemaProperty.properties) {
                    var property = ctx.schemaPropertyFactory.translateProperty(propertyName, swaggerSchemaProperty.properties[propertyName], (!!swaggerSchemaProperty.required) && swaggerSchemaProperty.required.indexOf(propertyName) >= 0, ctx);
                    if (property) {
                        properties[propertyName] = property;
                    }
                    else {
                        ctx.hasErrors = true;
                        properties[propertyName] = schema_1.getErorrProperty("Unable to translate Property " + propertyName);
                    }
                }
                return {
                    basicType: types_1.BasicType.OBJECT,
                    properties: properties
                };
            }
            else {
                return {
                    basicType: types_1.BasicType.OBJECT,
                    properties: []
                };
            }
        }
        return null;
    };
    return ObjectTypeProcessor;
}());
exports.ObjectTypeProcessor = ObjectTypeProcessor;
//# sourceMappingURL=objectTypeProcessor.js.map