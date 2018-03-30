"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var schemaProperty_1 = require("../schemaProcessor/schemaProperty");
var BasicTypeProcessor = /** @class */ (function () {
    function BasicTypeProcessor() {
        this.basicTypeMap = {
            null: types_1.BasicType.NULL,
            string: types_1.BasicType.STRING,
            boolean: types_1.BasicType.BOOLEAN,
            number: types_1.BasicType.NUMBER,
            integer: types_1.BasicType.NUMBER,
        };
        this.formatMap = {
            duration: types_1.BasicType.DURATION,
            date: types_1.BasicType.DATE,
            'date-time': types_1.BasicType.DATETIME,
            hostname: types_1.BasicType.HOSTNAME,
            email: types_1.BasicType.EMAIL,
            json: types_1.BasicType.JSON,
            binary: types_1.BasicType.BLOB,
            uuid: types_1.BasicType.UUID,
        };
    }
    BasicTypeProcessor.prototype.consume = function (swaggerSchemaProperty, typeName, ctx) {
        var name = ctx.propertyName;
        // Very basic type
        if (!swaggerSchemaProperty.format || typeName === 'null') {
            if (name.substr(-2) !== 'Id' || typeName === 'null' || name === 'emailId') {
                return {
                    basicType: this.basicTypeMap[typeName],
                };
            }
        }
        else if (this.formatMap[swaggerSchemaProperty.format]) {
            // formatted string
            if (typeName === 'string') {
                return {
                    basicType: this.formatMap[swaggerSchemaProperty.format],
                };
            }
            else if (swaggerSchemaProperty.type === 'null') {
                return {
                    basicType: types_1.BasicType.NULL,
                };
            }
            else {
                ctx.hasErrors = true;
                return schemaProperty_1.getErrorType("Property " + name + " has format " + swaggerSchemaProperty.format + ", but not string|null type " + typeName);
            }
        }
        return null;
    };
    return BasicTypeProcessor;
}());
exports.BasicTypeProcessor = BasicTypeProcessor;
//# sourceMappingURL=basicTypeProcessor.js.map