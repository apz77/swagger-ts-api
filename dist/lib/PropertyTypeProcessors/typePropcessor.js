"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schemaProperty_1 = require("../schemaProcessor/schemaProperty");
var objectTypeProcessor_1 = require("./objectTypeProcessor");
var enumTypeProcessor_1 = require("./enumTypeProcessor");
var arrayTypeProcessor_1 = require("./arrayTypeProcessor");
var basicTypeProcessor_1 = require("./basicTypeProcessor");
var linkTypeProcessor_1 = require("./linkTypeProcessor");
var modelTypeProcessor_1 = require("./modelTypeProcessor");
var TypeFactory = /** @class */ (function () {
    function TypeFactory(typeProcessors) {
        this.typeProcessors = typeProcessors;
    }
    TypeFactory.prototype.translateType = function (swaggerSchemaProperty, typeName, ctx) {
        for (var _i = 0, _a = this.typeProcessors; _i < _a.length; _i++) {
            var processor = _a[_i];
            var result = processor.consume(swaggerSchemaProperty, typeName, ctx);
            if (result) {
                return result;
            }
        }
        ctx.hasErrors = true;
        return schemaProperty_1.getErrorType("Unknown type or property " + JSON.stringify(swaggerSchemaProperty) + " " + typeName);
    };
    return TypeFactory;
}());
exports.TypeFactory = TypeFactory;
exports.defaultTypeProcessors = [
    new modelTypeProcessor_1.ModelTypeProcessor(),
    new linkTypeProcessor_1.LinkTypeProcessor(),
    new objectTypeProcessor_1.ObjectTypeProcessor(),
    new enumTypeProcessor_1.EnumTypeProcessor(),
    new arrayTypeProcessor_1.ArrayTypeProcessor(),
    new basicTypeProcessor_1.BasicTypeProcessor(),
];
//# sourceMappingURL=typePropcessor.js.map