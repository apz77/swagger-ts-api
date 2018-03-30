"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var fs = require("fs");
var schema_1 = require("./lib/schema");
var schemaProperty_1 = require("./lib/schemaProperty");
var defaultPropertyProcessor_1 = require("./lib/PropertyProcessor/defaultPropertyProcessor");
var typePropcessor_1 = require("./lib/PropertyTypeProcessors/typePropcessor");
var interfaceGenerator_1 = require("./lib/tsGenerators/interfaceGenerator");
var tsInterfacesStub_1 = require("./lib/tsInterfacesStub");
function generateTypescriptIntefacesWithMetadata(schemas, ctx, stub, basicTypesStub) {
    var interfaceGenerator = new interfaceGenerator_1.InterfaceGenerator();
    var interfaces = Object.keys(schemas).map(function (schemaName) {
        return interfaceGenerator.generate(schemas[schemaName], schemas, ctx);
    });
    var modelTypes = interfaceGenerator.generateModelTypes(schemas);
    return (stub ? stub : "") +
        (basicTypesStub ? basicTypesStub : tsInterfacesStub_1.defaultBaseTypesDefinition) +
        tsInterfacesStub_1.tsInterfacesHeader +
        modelTypes +
        interfaces.join("\n");
}
exports.generateTypescriptIntefacesWithMetadata = generateTypescriptIntefacesWithMetadata;
function parseSwagger(swaggerResponse, ctx) {
    if (swaggerResponse instanceof Object &&
        swaggerResponse.components instanceof Object &&
        swaggerResponse.components.schemas instanceof Object) {
        var schemaFactory = new schema_1.SchemaFactory(new schemaProperty_1.SchemaPropertyFactory([
            new defaultPropertyProcessor_1.DefaultPropertyProcessor(new typePropcessor_1.TypeFactory(typePropcessor_1.defaultTypeProcessors))
        ]));
        var schemas = {};
        for (var schemaName in swaggerResponse.components.schemas) {
            schemas[schemaName] = schemaFactory.translateSchema(schemaName, swaggerResponse.components.schemas[schemaName], ctx);
        }
        return schemas;
    }
    console.error("Swagger response is not corect one.");
    return null;
}
exports.parseSwagger = parseSwagger;
var schemaOutFile = 'schema.json';
var interfacesOutFile = 'models.ts';
if (fs.existsSync(schemaOutFile)) {
    fs.unlinkSync(schemaOutFile);
}
if (fs.existsSync(interfacesOutFile)) {
    fs.unlinkSync(interfacesOutFile);
}
request("http://127.0.0.1:3001/docs/swagger.json", function (error, response, body) {
    var responseJson = JSON.parse(body);
    var ctx = {
        hasErrors: false
    };
    var schemas = parseSwagger(responseJson, ctx);
    if (schemas) {
        fs.appendFileSync(schemaOutFile, JSON.stringify(schemas, null, 4));
        fs.appendFileSync(interfacesOutFile, generateTypescriptIntefacesWithMetadata(schemas, ctx));
    }
    console.log(ctx.hasErrors ? "Some errors occured during swagger translation" : "All is good");
});
//# sourceMappingURL=index.js.map