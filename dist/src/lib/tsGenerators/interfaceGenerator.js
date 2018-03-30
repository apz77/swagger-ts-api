"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var TypeToTsPropertyConverter_1 = require("./TypeToTsPropertyConverter");
var InterfaceGenerator = /** @class */ (function () {
    function InterfaceGenerator(template) {
        this.template = template
            ? template
            : "\n" +
                "export interface {{name}} extends BaseModel {\n" +
                "{{properties}}\n" +
                "}\n" +
                "\n" +
                "export module {{name}}Metadata {\n" +
                "\n" +
                "    const type = \"{{name}}\"\n" +
                "    const emptyModel: {{name}} = {{{emptyModelFields}}}\n" +
                "\n" +
                "    Object.freeze(emptyModel)\n" +
                "\n" +
                "    export module fields {\n" +
                "{{fieldsMetadata}}\n" +
                "    }\n" +
                "}\n";
        this.metadataFieldTemplate =
            "       export const {{name}} = {\n" +
                "           name: \"{{name}}\",\n" +
                "           types: {{types}},\n" +
                "           subType: \"{{subType}}\",\n" +
                "           isRequired: {{isRequired}},\n" +
                "           apiField: \"{{apiField}}\"\n" +
                "       }\n";
    }
    InterfaceGenerator.prototype.generateModelTypes = function (allSchemas) {
        return "export type ModelTypes = " + Object.keys(allSchemas).map(function (schemaName) { return "\"" + schemaName + "\""; }).join(" | ") + "\n";
    };
    InterfaceGenerator.prototype.generate = function (schema, allSchemas, ctx) {
        var _this = this;
        var typeToTsPropertyConverter = new TypeToTsPropertyConverter_1.TypeToTsPropertyConverter(allSchemas);
        var result = this.template.slice();
        // {{name}}
        result = result.replace(/{{name}}/g, schema.name);
        // {{properties}}
        var properties = schema.properties;
        var propertyNames = Object.keys(properties);
        var newCtx = Object.assign({
            howDeepIsYourLove: 1,
            schema: schema
        }, ctx);
        var interfaceProperties = propertyNames.map(function (propertyName) {
            var property = properties[propertyName];
            var types = property.types.map(function (type) { return typeToTsPropertyConverter.convert(type, newCtx); });
            return "    " + getPropertyName(property, newCtx) + (property.isRequired ? "" : "?") + ": " + types.join(" | ");
        });
        result = result.replace(/{{properties}}/g, interfaceProperties.join("\n"));
        // {{emptyModelFields}}
        var requiredFields = propertyNames
            .filter(function (propertyName) { return properties[propertyName].isRequired; })
            .map(function (propertyName) { return getPropertyName(properties[propertyName], newCtx) + ": v0"; });
        requiredFields.unshift("type: \"" + schema.name + "\"");
        result = result.replace(/{{emptyModelFields}}/g, requiredFields.join(","));
        // {{fieldsMetadata}}
        var fieldsMetadata = propertyNames
            .map(function (propertyName) {
            var property = properties[propertyName];
            var template = _this.metadataFieldTemplate.slice();
            template = template.replace(/{{name}}/g, getPropertyName(property, newCtx));
            template = template.replace(/{{types}}/g, _this.getPropertyMetadataTypes(property));
            template = template.replace(/{{subType}}/g, _this.getPropertyMetadataSubType(property));
            template = template.replace(/{{isRequired}}/g, "" + property.isRequired);
            template = template.replace(/{{apiField}}/g, propertyName);
            return template;
        })
            .join("");
        result = result.replace(/{{fieldsMetadata}}/g, fieldsMetadata);
        ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;
        return result;
    };
    InterfaceGenerator.prototype.getPropertyMetadataTypes = function (property) {
        return "[" + property.types.map(function (type) { return "\"" + type.basicType + "\""; }).join(", ") + "]";
    };
    InterfaceGenerator.prototype.getPropertyMetadataSubType = function (property) {
        var linkType = property.types.find(function (type) { return type.basicType === types_1.BasicType.LINK; });
        if (linkType) {
            return linkType.linkTo;
        }
        return "";
    };
    return InterfaceGenerator;
}());
exports.InterfaceGenerator = InterfaceGenerator;
function getPropertyName(property, ctx) {
    if (property.types.find(function (type) { return type.basicType === types_1.BasicType.LINK; })) {
        if (property.name.substr(-2) === "Id") {
            return property.name.substr(0, property.name.length - 2);
        }
        console.log("Property " + ctx.schema.name + "." + property.name + " is a link, but does not end with Id.");
    }
    return property.name;
}
exports.getPropertyName = getPropertyName;
//# sourceMappingURL=interfaceGenerator.js.map
