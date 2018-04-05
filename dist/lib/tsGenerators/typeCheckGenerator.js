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
            .filter(function (key) { return properties[key].isRequired; })
            .map(function (key) { return "arg." + properties[key].name + " !== " + _this.apiPrefix + "v0"; });
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