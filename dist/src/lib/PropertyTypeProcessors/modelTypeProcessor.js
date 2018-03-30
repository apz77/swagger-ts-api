"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var ModelTypeProcessor = /** @class */ (function () {
    function ModelTypeProcessor() {
    }
    ModelTypeProcessor.prototype.consume = function (swaggerSchemaProperty, typeName, ctx) {
        var metadata = swaggerSchemaProperty["x-metadata"];
        if (typeName !== "null" && typeName !== "array") {
            if (metadata && metadata.schema) {
                switch (metadata.schema) {
                    case "Schema": return {
                        basicType: types_1.BasicType.MODELTYPE
                    };
                    case "SchemaId": return {
                        basicType: types_1.BasicType.MODELID
                    };
                }
            }
        }
        return null;
    };
    return ModelTypeProcessor;
}());
exports.ModelTypeProcessor = ModelTypeProcessor;
//# sourceMappingURL=modelTypeProcessor.js.map