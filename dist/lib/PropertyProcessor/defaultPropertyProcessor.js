"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
        var inPathPart = property.description && property.description.toLocaleLowerCase() === 'taken from path'
            ? { inPath: true }
            : {};
        return __assign({ name: name,
            isRequired: isRequired }, inPathPart, { types: propTypes.map(function (typeName) { return _this.typeFactory.translateType(property, typeName, factoryContext); }) });
    };
    return DefaultPropertyProcessor;
}());
exports.DefaultPropertyProcessor = DefaultPropertyProcessor;
//# sourceMappingURL=defaultPropertyProcessor.js.map