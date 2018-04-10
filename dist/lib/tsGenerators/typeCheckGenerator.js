"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var TypeCheckGenerator = /** @class */ (function () {
    function TypeCheckGenerator() {
        this.apiPrefix = 'Api.';
        this.template = tsInterfacesStub_1.typeCheckTemplate;
    }
    TypeCheckGenerator.prototype.generate = function (schema, ctx) {
        var _this = this;
        var result = this.template.slice();
        var properties = schema.properties;
        result = result.replace(/{{name}}/g, schema.name);
        // {{requiredProps}}
        var props = Object.keys(properties)
            .filter(function (key) { return properties[key].isRequired && !properties[key].types.find(function (type) { return type.properties; }); })
            .map(function (key) { return "arg." + properties[key].name + " !== " + _this.apiPrefix + "v0"; });
        var objectProps = Object.keys(properties)
            .filter(function (key) { return properties[key].isRequired && properties[key].types.find(function (type) { return type.properties; }); });
        props = props.concat(objectProps.map(function (key) { return "Object(arg." + properties[key].name + ") === arg." + properties[key].name; }));
        var _loop_1 = function (subObject) {
            var subProp = properties[subObject];
            var subProps = subProp.types.find(function (type) { return type.properties; });
            if (subProps) {
                var subPropProps_1 = subProps.properties;
                props = props.concat(Object.keys(subPropProps_1).map(function (key) { return "arg." + subProp.name + "." + subPropProps_1[key].name + " !== " + _this.apiPrefix + "v0"; }));
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