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


export function generateTypescriptIntefacesWithMetadata(
    schemas: AllSchemas,
    ctx: {hasErrors: boolean},
    stub?: string,
    basicTypesStub?: string): string {

  const interfaceGenerator = new InterfaceGenerator();

  const newCtx = {
    ...ctx,
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

export function generateTypeScriptModule(paths: Paths, allSchemas: AllSchemas, ctx: {hasErrors: boolean}) {

  const methodToTsGenerator = new MethodGenerator();
  const interfaceGenerator = new InterfaceGenerator();
  const moduleGenerator = new ModuleGenerator(interfaceGenerator, methodToTsGenerator);


  return Object.keys(paths).map((moduleName) => {
    return moduleGenerator.generateModule(moduleName, paths[moduleName], allSchemas, ctx);
  }).join('\n');
}

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
      schemas[schemaName] = schemaFactory.translateSchema(
          schemaName,
          swaggerResponse.components.schemas[schemaName],
          ctx,
      );
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
