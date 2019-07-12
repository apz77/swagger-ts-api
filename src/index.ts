import { SchemaFactory, SchemaFactoryContext } from './lib/schemaProcessor/schema';
import { SchemaPropertyFactory } from './lib/schemaProcessor/schemaProperty';
import { DefaultPropertyProcessor } from './lib/PropertyProcessor/defaultPropertyProcessor';
import { defaultTypeProcessors, TypeFactory } from './lib/PropertyTypeProcessors/typePropcessor';
import { AllSchemas, Paths, SwaggerPaths } from './lib/types';
import { InterfaceGenerator } from './lib/tsGenerators/interfaceGenerator';
import { defaultBaseTypesDefinition, tsInterfacesHeader } from './lib/tsGenerators/tsInterfacesStub';
import { PathsProcessor } from './lib/pathsProcessor/pathsProcessor';
import { PathProcessor } from './lib/pathsProcessor/pathProcessor';
import { MethodGenerator } from './lib/tsGenerators/methodGenerator';
import { ModuleGenerator } from './lib/tsGenerators/moduleGenerator';
import { TypeFileGenerator } from './lib/tsGenerators/typeFileGenerator';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { TypeCheckGenerator } from './lib/tsGenerators/typeCheckGenerator';
import { IndexFileGenerator } from './lib/tsGenerators/indexFileGenerator';

export function clearDirectory(dir: string, callback: (error: Error) => void) {
  rimraf(dir, callback);
}

/**
 * Creates ts files to work with API
 * @param {string} filesPath - filesystem path to put files into
 * @param {Paths} paths - parsed swagger method paths
 * @param {AllSchemas} schemas - parsed swagger all schemas
 * @param {{hasErrors: boolean}} ctx
 */
export function generateTypeScriptFiles(filesPath: string,
                                        paths: Paths,
                                        schemas: AllSchemas,
                                        ctx: {hasErrors: boolean, rawTypes: boolean}): void {

  const methodToTsGenerator = new MethodGenerator();
  const interfaceGenerator = new InterfaceGenerator();
  const typeCheckGenerator = new TypeCheckGenerator();
  const indexFileGenerator = new IndexFileGenerator(interfaceGenerator);
  const moduleGenerator = new ModuleGenerator(interfaceGenerator, methodToTsGenerator, typeCheckGenerator, indexFileGenerator);
  const typeFileGenerator = new TypeFileGenerator(moduleGenerator, interfaceGenerator, typeCheckGenerator, indexFileGenerator);

  const pathsTags = Object.keys(paths)
      .reduce((result, key) => result.concat(paths[key].map(path => path.tag)), [] as string[]);

  const tags = [
    ...pathsTags,
    ...Object.keys(schemas).map(tag => tag.toLowerCase()),
  ].filter((value, index, array) => array.indexOf(value) === index);

  for (const tag of tags) {
    const filename = filesPath + typeFileGenerator.getFileName(tag) + '.ts';
    const fileContent = typeFileGenerator.generate(paths, schemas, tag, ctx);
    replaceFile(filename, fileContent);

    const moduleFilename = filesPath + moduleGenerator.getFilename(tag) + '.ts';
    const moduleFileContent = moduleGenerator.generate(tag, paths[tag] || [], schemas, { ...ctx, tabs: 0 });
    replaceFile(moduleFilename, moduleFileContent);

    if (schemas[tag]) {
      const metadataFileName = filesPath + typeFileGenerator.getFileName(tag) + 'Metadata.ts';
      const metadataFileContent = interfaceGenerator.generateMetadata(
        schemas[tag],
        schemas,
        { ...ctx, tabs: 0, usedTypes: {}, isResponse: false },
      );
      replaceFile(metadataFileName, metadataFileContent);
    }
  }

  const indexFile = filesPath + indexFileGenerator.getIndexFileName() + '.ts';
  const indexFileContent = indexFileGenerator.generateIndex(schemas, tags);
  replaceFile(indexFile, indexFileContent);
}

function replaceFile(filename: string, content: string) {
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
export function parseSwagger(swaggerResponse: any, ctx: SchemaFactoryContext):
  {schemas: AllSchemas, paths: Paths} | null {
  if (swaggerResponse instanceof Object &&
    swaggerResponse.components instanceof Object &&
    swaggerResponse.components.schemas instanceof Object &&
    swaggerResponse.paths instanceof Object) {
    const schemaFactory = new SchemaFactory(
      new SchemaPropertyFactory(
        [
          new DefaultPropertyProcessor(
            new TypeFactory(defaultTypeProcessors),
          ),
        ],
      ),
    );

    const schemas: AllSchemas = {};


    for (const schemaName in swaggerResponse.components.schemas) {
      const parsedSchemas = schemaFactory.translateSchema(
        schemaName,
        swaggerResponse.components.schemas[schemaName],
        ctx,
      );
      if (Array.isArray(parsedSchemas)) {
        ctx.hasErrors = true;
        console.error(`Multi schemas for models are not supported.`);
        schemas[schemaName] = parsedSchemas[0];
      } else if (parsedSchemas === null) {
        console.error(`Null schema for model detected.`);
      } else {
        schemas[schemaName] = parsedSchemas;
      }

    }

    const pathsProcessor = new PathsProcessor(new PathProcessor(schemaFactory));

    return {
      schemas,
      paths: pathsProcessor.translatePaths(swaggerResponse.paths as SwaggerPaths, ctx),
    };
  }

  console.error(`Swagger response is not corect one.`);

  return null;
}

// Some other helper files

export function generateTypescriptIntefacesWithMetadata(
    schemas: AllSchemas,
    ctx: {hasErrors: boolean, rawTypes: boolean},
    stub?: string,
    basicTypesStub?: string): string {

  const interfaceGenerator = new InterfaceGenerator();

  const newCtx = {
    ...ctx,
    usedTypes: {},
    isResponse: false,
    tabs: 0,
  };

  const interfaces = Object.keys(schemas).map((schemaName) => {
    return interfaceGenerator.generate(schemas[schemaName], schemas, newCtx) +
           interfaceGenerator.generateMetadata(schemas[schemaName], schemas, newCtx);
  });

  const modelTypes = interfaceGenerator.generateModelTypes(schemas);

  return (stub ? stub : '') +
        (basicTypesStub ? basicTypesStub : defaultBaseTypesDefinition) +
        tsInterfacesHeader +
        modelTypes +
        interfaces.join('\n');
}

export function generateTypeScriptModule(paths: Paths, schemas: AllSchemas, ctx: { hasErrors: boolean, rawTypes: boolean }) {

  const methodToTsGenerator = new MethodGenerator();
  const interfaceGenerator = new InterfaceGenerator();
  const typeCheckGenerator = new TypeCheckGenerator();
  const indexFileGenerator = new IndexFileGenerator(interfaceGenerator);
  const moduleGenerator = new ModuleGenerator(interfaceGenerator, methodToTsGenerator, typeCheckGenerator, indexFileGenerator);


  return Object.keys(paths).map((moduleName) => {
    return moduleGenerator.generate(moduleName, paths[moduleName], schemas, { ...ctx, tabs: 0 });
  }).join('\n');
}
