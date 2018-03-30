"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var schemaProperty_1 = require("../schemaProperty");
var ArrayTypeProcessor = /** @class */ (function () {
    function ArrayTypeProcessor() {
    }
    ArrayTypeProcessor.prototype.consume = function (swaggerSchemaProperty, typeName, ctx) {
        if (typeName === "array") {
            var metadata = swaggerSchemaProperty["x-metadata"];
            if (metadata && metadata.schema) {
                return {
                    basicType: types_1.BasicType.ARRAY,
                    arrayType: {
                        basicType: types_1.BasicType.LINK,
                        linkTo: metadata.schema
                    }
                };
            }
            else if (swaggerSchemaProperty.items && (typeof swaggerSchemaProperty.items.type === 'string')) {
                return {
                    basicType: types_1.BasicType.ARRAY,
                    arrayType: ctx.typeFactory.translateType(swaggerSchemaProperty.items, swaggerSchemaProperty.items.type, ctx)
                };
            }
            else {
                ctx.hasErrors = true;
                return schemaProperty_1.getErrorType("No item for array type defined.");
            }
        }
        return null;
    };
    return ArrayTypeProcessor;
}());
exports.ArrayTypeProcessor = ArrayTypeProcessor;
//# sourceMappingURL=arrayTypeProcessor.js.map