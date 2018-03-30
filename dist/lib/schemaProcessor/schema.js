"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schemaProperty_1 = require("./schemaProperty");
var SchemaFactory = /** @class */ (function () {
    function SchemaFactory(schemaPropertyFactory) {
        this.schemaPropertyFactory = schemaPropertyFactory;
    }
    SchemaFactory.prototype.translateSchema = function (name, schema, schemaFactoryContext) {
        var resultSchema = {
            name: name,
            properties: {},
        };
        var ctx = Object.assign({
            schemaName: name,
            swaggerSchema: schema,
            schemaPropertyFactory: this.schemaPropertyFactory,
        }, schemaFactoryContext);
        for (var propertyName in schema.properties) {
            var property = this.schemaPropertyFactory.translateProperty(propertyName, schema.properties[propertyName], (!!schema.required) && schema.required.indexOf(propertyName) >= 0, ctx);
            if (property) {
                resultSchema.properties[propertyName] = property;
            }
            else {
                resultSchema.properties[propertyName] = getErorrProperty("Unable to translate Property " + propertyName);
                ctx.hasErrors = true;
            }
        }
        schemaFactoryContext.hasErrors = schemaFactoryContext.hasErrors || ctx.hasErrors;
        return resultSchema;
    };
    return SchemaFactory;
}());
exports.SchemaFactory = SchemaFactory;
function getErorrProperty(description) {
    return {
        name: description,
        isRequired: false,
        types: [schemaProperty_1.getErrorType("No appropriate type found")],
    };
}
exports.getErorrProperty = getErorrProperty;
//# sourceMappingURL=schema.js.map