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
var schema_1 = require("./lib/schemaProcessor/schema");
var schemaProperty_1 = require("./lib/schemaProcessor/schemaProperty");
var defaultPropertyProcessor_1 = require("./lib/PropertyProcessor/defaultPropertyProcessor");
var typePropcessor_1 = require("./lib/PropertyTypeProcessors/typePropcessor");
var interfaceGenerator_1 = require("./lib/tsGenerators/interfaceGenerator");
var tsInterfacesStub_1 = require("./lib/tsGenerators/tsInterfacesStub");
var pathsProcessor_1 = require("./lib/pathsProcessor/pathsProcessor");
var pathProcessor_1 = require("./lib/pathsProcessor/pathProcessor");
var methodGenerator_1 = require("./lib/tsGenerators/methodGenerator");
var moduleGenerator_1 = require("./lib/tsGenerators/moduleGenerator");
var typeFileGenerator_1 = require("./lib/tsGenerators/typeFileGenerator");
var fs = require("fs");
var rimraf = require("rimraf");
var typeCheckGenerator_1 = require("./lib/tsGenerators/typeCheckGenerator");
var indexFileGenerator_1 = require("./lib/tsGenerators/indexFileGenerator");
function clearDirectory(dir, callback) {
    rimraf(dir, callback);
}
exports.clearDirectory = clearDirectory;
/**
 * Creates ts files to work with API
 * @param {string} filesPath - filesystem path to put files into
 * @param {Paths} paths - parsed swagger method paths
 * @param {AllSchemas} schemas - parsed swagger all schemas
 * @param {{hasErrors: boolean}} ctx
 */
function generateTypeScriptFiles(filesPath, paths, schemas, ctx) {
    var methodToTsGenerator = new methodGenerator_1.MethodGenerator();
    var interfaceGenerator = new interfaceGenerator_1.InterfaceGenerator();
    var typeCheckGenerator = new typeCheckGenerator_1.TypeCheckGenerator();
    var indexFileGenerator = new indexFileGenerator_1.IndexFileGenerator(interfaceGenerator);
    var moduleGenerator = new moduleGenerator_1.ModuleGenerator(interfaceGenerator, methodToTsGenerator, typeCheckGenerator, indexFileGenerator);
    var typeFileGenerator = new typeFileGenerator_1.TypeFileGenerator(moduleGenerator, interfaceGenerator, typeCheckGenerator, indexFileGenerator);
    var pathsTags = Object.keys(paths)
        .reduce(function (result, key) { return result.concat(paths[key].map(function (path) { return path.tag; })); }, []);
    var tags = pathsTags.concat(Object.keys(schemas).map(function (tag) { return tag; })).filter(function (value, index, array) { return array.indexOf(value) === index; });
    var _loop_1 = function (tag) {
        var pathName = Object.keys(paths).find(function (paths) { return paths.toLowerCase() === tag.toLowerCase(); });
        var filename = filesPath + typeFileGenerator.getFileName(tag) + '.ts';
        var fileContent = typeFileGenerator.generate(paths, schemas, tag, ctx);
        replaceFile(filename, fileContent);
        var moduleFilename = filesPath + moduleGenerator.getFilename(tag) + '.ts';
        var moduleFileContent = moduleGenerator.generate(tag, pathName && paths[pathName] || [], schemas, __assign({}, ctx, { tabs: 0 }));
        replaceFile(moduleFilename, moduleFileContent);
        if (schemas[tag]) {
            var metadataFileName = filesPath + typeFileGenerator.getFileName(tag) + 'Metadata.ts';
            var metadataFileContent = interfaceGenerator.generateMetadata(schemas[tag], schemas, __assign({}, ctx, { tabs: 0, usedTypes: {}, isResponse: false }));
            replaceFile(metadataFileName, metadataFileContent);
        }
    };
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var tag = tags_1[_i];
        _loop_1(tag);
    }
    var indexFile = filesPath + indexFileGenerator.getIndexFileName() + '.ts';
    var indexFileContent = indexFileGenerator.generateIndex(schemas, tags);
    replaceFile(indexFile, indexFileContent);
}
exports.generateTypeScriptFiles = generateTypeScriptFiles;
function replaceFile(filename, content) {
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
    fs.appendFileSync(filename, content);
}
/**
 * Parses swagger doc json file into inner format
 * @param swaggerResponse - swagger doc in json format
 * @param {SchemaFactoryContext} ctx
 * @return {{schemas: AllSchemas; paths: Paths} | null}
 */
function parseSwagger(swaggerResponse, ctx) {
    if (swaggerResponse instanceof Object &&
        swaggerResponse.components instanceof Object &&
        swaggerResponse.components.schemas instanceof Object &&
        swaggerResponse.paths instanceof Object) {
        var schemaFactory = new schema_1.SchemaFactory(new schemaProperty_1.SchemaPropertyFactory([
            new defaultPropertyProcessor_1.DefaultPropertyProcessor(new typePropcessor_1.TypeFactory(typePropcessor_1.defaultTypeProcessors)),
        ]));
        var schemas = {};
        for (var schemaName in swaggerResponse.components.schemas) {
            var parsedSchemas = schemaFactory.translateSchema(schemaName, swaggerResponse.components.schemas[schemaName], ctx);
            if (Array.isArray(parsedSchemas)) {
                ctx.hasErrors = true;
                console.error("Multi schemas for models are not supported.");
                schemas[schemaName] = parsedSchemas[0];
            }
            else if (parsedSchemas === null) {
                console.error("Null schema for model detected.");
            }
            else {
                schemas[schemaName] = parsedSchemas;
            }
        }
        var pathsProcessor = new pathsProcessor_1.PathsProcessor(new pathProcessor_1.PathProcessor(schemaFactory));
        return {
            schemas: schemas,
            paths: pathsProcessor.translatePaths(swaggerResponse.paths, ctx),
        };
    }
    console.error("Swagger response is not corect one.");
    return null;
}
exports.parseSwagger = parseSwagger;
// Some other helper files
function generateTypescriptIntefacesWithMetadata(schemas, ctx, stub, basicTypesStub) {
    var interfaceGenerator = new interfaceGenerator_1.InterfaceGenerator();
    var newCtx = __assign({}, ctx, { usedTypes: {}, isResponse: false, tabs: 0 });
    var interfaces = Object.keys(schemas).map(function (schemaName) {
        return interfaceGenerator.generate(schemas[schemaName], schemas, newCtx) +
            interfaceGenerator.generateMetadata(schemas[schemaName], schemas, newCtx);
    });
    var modelTypes = interfaceGenerator.generateModelTypes(schemas);
    return (stub ? stub : '') +
        (basicTypesStub ? basicTypesStub : tsInterfacesStub_1.defaultBaseTypesDefinition) +
        tsInterfacesStub_1.tsInterfacesHeader +
        modelTypes +
        interfaces.join('\n');
}
exports.generateTypescriptIntefacesWithMetadata = generateTypescriptIntefacesWithMetadata;
function generateTypeScriptModule(paths, schemas, ctx) {
    var methodToTsGenerator = new methodGenerator_1.MethodGenerator();
    var interfaceGenerator = new interfaceGenerator_1.InterfaceGenerator();
    var typeCheckGenerator = new typeCheckGenerator_1.TypeCheckGenerator();
    var indexFileGenerator = new indexFileGenerator_1.IndexFileGenerator(interfaceGenerator);
    var moduleGenerator = new moduleGenerator_1.ModuleGenerator(interfaceGenerator, methodToTsGenerator, typeCheckGenerator, indexFileGenerator);
    return Object.keys(paths).map(function (moduleName) {
        return moduleGenerator.generate(moduleName, paths[moduleName], schemas, __assign({}, ctx, { tabs: 0 }));
    }).join('\n');
}
exports.generateTypeScriptModule = generateTypeScriptModule;
//# sourceMappingURL=index.js.map