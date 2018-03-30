"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultPropertyProcessor = /** @class */ (function () {
    function DefaultPropertyProcessor(typeFactory) {
        this.typeFactory = typeFactory;
    }
    DefaultPropertyProcessor.prototype.consume = function (name, property, isRequired, ctx) {
        var _this = this;
        var propTypes = Array.isArray(property.type) ? property.type : [property.type];
        var factoryContext = Object.assign({
            propertyName: name,
            swaggerSchemaProperty: property,
            typeFactory: this.typeFactory,
        }, ctx);
        return {
            name: name,
            isRequired: isRequired,
            types: propTypes.map(function (typeName) { return _this.typeFactory.translateType(property, typeName, factoryContext); }),
        };
    };
    return DefaultPropertyProcessor;
}());
exports.DefaultPropertyProcessor = DefaultPropertyProcessor;
//# sourceMappingURL=defaultPropertyProcessor.js.map