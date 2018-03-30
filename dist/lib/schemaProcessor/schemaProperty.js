"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var SchemaPropertyFactory = /** @class */ (function () {
    function SchemaPropertyFactory(propertyProcessors) {
        this.propertyProcessors = propertyProcessors;
    }
    SchemaPropertyFactory.prototype.translateProperty = function (schemaName, swaggerProperty, isRequired, ctx) {
        for (var _i = 0, _a = this.propertyProcessors; _i < _a.length; _i++) {
            var processor = _a[_i];
            var result = processor.consume(schemaName, swaggerProperty, isRequired, ctx);
            if (result) {
                return result;
            }
        }
        return null;
    };
    return SchemaPropertyFactory;
}());
exports.SchemaPropertyFactory = SchemaPropertyFactory;
function getErrorType(error) {
    console.error(error);
    return {
        error: error,
        basicType: types_1.BasicType.ERROR,
    };
}
exports.getErrorType = getErrorType;
//# sourceMappingURL=schemaProperty.js.map