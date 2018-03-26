import { SchemaFactory, SchemaFactoryContext } from "./lib/schema";
import { SchemaPropertyFactory } from "./lib/schemaProperty";
import { DefaultPropertyProcessor } from "./lib/PropertyProcessor/defaultPropertyProcessor";
import { defaultTypeProcessors, TypeFactory } from "./lib/PropertyTypeProcessors/typePropcessor";
import { AllSchemas } from "./lib/types";
import { InterfaceGenerator, InterfaceGeneratorContext } from "./lib/tsGenerators/interfaceGenerator";
import { defaultBaseTypesDefinition, tsInterfacesHeader } from "./lib/tsInterfacesStub";


export function generateTypescriptIntefacesWithMetadata(
    schemas: AllSchemas,
    ctx: InterfaceGeneratorContext,
    stub?: string,
    basicTypesStub?: string): string {
    const interfaceGenerator = new InterfaceGenerator()

    const interfaces = Object.keys(schemas).map((schemaName) => {
        return interfaceGenerator.generate(schemas[schemaName], schemas, ctx)
    })

    const modelTypes = interfaceGenerator.generateModelTypes(schemas)

    return (stub ? stub : "") +
        (basicTypesStub ? basicTypesStub : defaultBaseTypesDefinition) +
        tsInterfacesHeader +
        modelTypes +
        interfaces.join("\n")
}

export function parseSwagger(swaggerResponse: any, ctx: SchemaFactoryContext): AllSchemas | null {
    if (swaggerResponse instanceof Object &&
        swaggerResponse.components instanceof Object &&
        swaggerResponse.components.schemas instanceof Object) {
        const schemaFactory = new SchemaFactory(
            new SchemaPropertyFactory(
                [
                    new DefaultPropertyProcessor(
                        new TypeFactory(defaultTypeProcessors)
                    )
                ]
            )
        )

        const schemas: AllSchemas = {}


        for(let schemaName in swaggerResponse.components.schemas) {
            schemas[schemaName] = schemaFactory.translateSchema(schemaName, swaggerResponse.components.schemas[schemaName], ctx)
        }

        return schemas
    }

    console.error(`Swagger response is not corect one.`)

    return null
}
