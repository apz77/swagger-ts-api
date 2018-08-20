"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schemaProperty_1 = require("../schemaProcessor/schemaProperty");
var types_1 = require("../types");
var EnumTypeProcessor = /** @class */ (function () {
    function EnumTypeProcessor() {
    }
    EnumTypeProcessor.prototype.consume = function (swaggerSchemaProperty, typeName, ctx) {
        if (swaggerSchemaProperty.enum) {
            if (typeName === 'string' || typeName === 'number') {
                return {
                    basicType: types_1.BasicType.ENUM,
                    values: swaggerSchemaProperty.enum,
                };
            }
            else if (typeName === 'null') {
                return {
                    basicType: types_1.BasicType.NULL,
                };
            }
            ctx.hasErrors = true;
            return schemaProperty_1.getErrorType("Property is enum, but basic type is not string|null " + typeName);
        }
        return null;
    };
    return EnumTypeProcessor;
}());
exports.EnumTypeProcessor = EnumTypeProcessor;
//# sourceMappingURL=enumTypeProcessor.js.map