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
var types_1 = require("../types");
var typeToTsPropertyConverter_1 = require("./typeToTsPropertyConverter");
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var InterfaceGenerator = /** @class */ (function () {
    function InterfaceGenerator(template, metadataTemplate, metadataFieldTemplate) {
        this.apiPrefix = 'Api.';
        this.template = template || tsInterfacesStub_1.defaultInterfaceTemplate;
        this.metadataFieldTemplate = metadataFieldTemplate || tsInterfacesStub_1.defaultFieldMetadataTemplate;
        this.metadataTemplate = metadataTemplate || tsInterfacesStub_1.defaultMetadataTemplate;
    }
    InterfaceGenerator.prototype.generateModelTypes = function (allSchemas) {
        return "export type ModelTypes = " + Object.keys(allSchemas).map(function (schemaName) { return "'" + schemaName + "'"; }).join(' | ') + "\n";
    };
    InterfaceGenerator.prototype.generate = function (schema, allSchemas, ctx) {
        var _this = this;
        var typeToTsPropertyConverter = new typeToTsPropertyConverter_1.TypeToTsPropertyConverter(allSchemas);
        var result = this.template.slice();
        var tabs = ctx.tabs || 0;
        // {{name}}
        result = result.replace(/{{name}}/g, schema.name);
        // {{properties}}
        var properties = schema.properties;
        var propertyNames = Object.keys(properties);
        var newCtx = __assign({}, ctx, { schema: schema, tabs: tabs + 1 });
        var interfaceProperties = propertyNames.map(function (propertyName) {
            var property = properties[propertyName];
            var types = property.types.map(function (type) { return typeToTsPropertyConverter.convert(type, _this.apiPrefix, __assign({}, newCtx, { tabs: 1 })); });
            return "" + tsInterfacesStub_1.tabsStub + getPropertyName(property, newCtx) + (property.isRequired ? '' : '?') + ": " +
                ("" + types.join(' | '));
        });
        result = result.replace(/{{properties}}/g, interfaceProperties.map(function (item) { return item + ";"; }).join('\n'));
        ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;
        if (tabs) {
            result = result.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(tabs) + item; }).join('\n');
        }
        return result;
    };
    InterfaceGenerator.prototype.generateMetadata = function (schema, allSchemas, ctx) {
        var _this = this;
        var result = this.metadataTemplate.slice();
        var properties = schema.properties;
        var propertyNames = Object.keys(properties);
        var newCtx = Object.assign({
            schema: schema,
            tabs: (ctx.tabs || 0) + 1,
        }, ctx);
        // {{name}}
        result = result.replace(/{{name}}/g, schema.name);
        // {{emptyModelFields}}
        /* const requiredFields = propertyNames
                .filter(propertyName => properties[propertyName].isRequired)
                .map(propertyName => `${getPropertyName(properties[propertyName], newCtx)}: Api.v0`);
    
          result = result.replace(/{{emptyModelFields}}/g, requiredFields.join(','));
        */
        result = result.replace(/{{emptyModelFields}}/g, '');
        // {{fieldsMetadata}}
        var fieldsMetadata = propertyNames
            .map(function (propertyName) {
            var property = properties[propertyName];
            var template = _this.metadataFieldTemplate.slice();
            var tabs = newCtx.tabs + 1;
            template = template.replace(/{{name}}/g, getPropertyName(property, newCtx));
            template = template.replace(/{{types}}/g, _this.getPropertyMetadataTypes(property));
            template = template.replace(/{{subType}}/g, _this.getPropertyMetadataSubType(property));
            template = template.replace(/{{isRequired}}/g, "" + property.isRequired);
            template = template.replace(/{{apiField}}/g, propertyName);
            template = template.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(tabs) + item; }).join('\n');
            return template;
        })
            .join('\n');
        ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;
        result = result.replace(/{{fieldsMetadata}}/g, fieldsMetadata);
        if (ctx.tabs) {
            result = result.split('\n').map(function (item) { return tsInterfacesStub_1.tabsStub.repeat(ctx.tabs) + item; }).join('\n');
        }
        return result;
    };
    InterfaceGenerator.prototype.getPropertyMetadataTypes = function (property) {
        return "[" + property.types.map(function (type) { return "'" + type.basicType + "'"; }).join(', ') + "]";
    };
    InterfaceGenerator.prototype.getPropertyMetadataSubType = function (property) {
        var linkType = property.types.find(function (type) { return type.basicType === types_1.BasicType.LINK; });
        if (linkType) {
            return linkType.linkTo;
        }
        var arrayType = property.types.find(function (type) { return type.basicType === types_1.BasicType.ARRAY; });
        if (arrayType) {
            if (arrayType.arrayType.basicType === types_1.BasicType.LINK) {
                return arrayType.arrayType.linkTo;
            }
            return arrayType.arrayType.basicType;
        }
        return '';
    };
    return InterfaceGenerator;
}());
exports.InterfaceGenerator = InterfaceGenerator;
function getPropertyName(property, ctx) {
    if (!ctx.rawTypes && property.types.find(function (type) { return type.basicType === types_1.BasicType.LINK; })) {
        if (property.name.substr(-2) === 'Id') {
            return property.name.substr(0, property.name.length - 2);
        }
        if (property.name.indexOf('Id') >= 0) {
            if (!ctx.isResponse) {
                console.warn("Property " + ctx.schema.name + "." + property.name + " is a link, but does not end with Id.");
            }
            return property.name.replace('Id', '');
        }
        if (!ctx.isResponse) {
            console.warn("Property " + ctx.schema.name + "." + property.name + " is a link, but does not end with Id.");
        }
    }
    return property.name;
}
exports.getPropertyName = getPropertyName;
//# sourceMappingURL=interfaceGenerator.js.map