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
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var interfaceGenerator_1 = require("./interfaceGenerator");
var TypeCheckGenerator = /** @class */ (function () {
    function TypeCheckGenerator() {
        this.apiPrefix = 'Api.';
        this.template = tsInterfacesStub_1.typeCheckTemplate;
    }
    TypeCheckGenerator.prototype.generate = function (schema, ctx) {
        var _this = this;
        var result = this.template.slice();
        var properties = schema.properties;
        var newCtx = __assign({}, ctx, { usedTypes: {}, schema: schema, isResponse: false });
        result = result.replace(/{{name}}/g, schema.name);
        // {{requiredProps}}
        var props = Object.keys(properties)
            .filter(function (key) { return properties[key].isRequired && !properties[key].types.find(function (type) { return type.properties; }); })
            .map(function (key) { return "arg." + interfaceGenerator_1.getPropertyName(properties[key], newCtx) + " !== " + _this.apiPrefix + "v0"; });
        var objectProps = Object.keys(properties)
            .filter(function (key) { return properties[key].isRequired && properties[key].types.find(function (type) { return type.properties; }); });
        props = props.concat(objectProps.map(function (key) { return "Object(arg." + interfaceGenerator_1.getPropertyName(properties[key], newCtx) + ") === arg." + properties[key].name; }));
        var _loop_1 = function (subObject) {
            var subProp = properties[subObject];
            var subProps = subProp.types.find(function (type) { return type.properties; });
            if (subProps) {
                var subPropProps_1 = subProps.properties;
                props = props.concat(Object.keys(subPropProps_1)
                    .filter(function (key) { return !!subPropProps_1[key].isRequired; })
                    .map(function (key) { return "arg." + interfaceGenerator_1.getPropertyName(subProp, newCtx) + "." + subPropProps_1[key].name + " !== " + _this.apiPrefix + "v0"; }));
            }
        };
        for (var _i = 0, objectProps_1 = objectProps; _i < objectProps_1.length; _i++) {
            var subObject = objectProps_1[_i];
            _loop_1(subObject);
        }
        result = result.replace(/{{requiredProps}}/g, props.length
            ? (' && ' + props.join(' && '))
            : '');
        if (ctx.tabs > 0) {
            result = result.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(ctx.tabs) + item; }).join('\n');
        }
        return result;
    };
    return TypeCheckGenerator;
}());
exports.TypeCheckGenerator = TypeCheckGenerator;
//# sourceMappingURL=typeCheckGenerator.js.map