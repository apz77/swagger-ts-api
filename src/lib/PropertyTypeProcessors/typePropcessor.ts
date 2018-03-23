import { PropertyType, SwaggerSchemaProperty } from "../types";
import { getErrorType, PropertyProcessorContext } from "../schemaProperty";
import { ObjectTypeProcessor } from "./objectTypeProcessor";
import { EnumTypeProcessor } from "./enumTypeProcessor";
import { ArrayTypeProcessor } from "./arrayTypeProcessor";
import { BasicTypeProcessor } from "./basicTypeProcessor";
import { LinkTypeProcessor } from "./linkTypeProcessor";

export interface TypeFactoryContext extends PropertyProcessorContext {
    propertyName: string
    swaggerSchemaProperty: SwaggerSchemaProperty
    typeFactory: TypeFactory
}

export class TypeFactory {
    constructor(protected typeProcessors: TypeProcessor[]) {}

    translateType(swaggerSchemaProperty: SwaggerSchemaProperty, typeName: string, ctx: TypeProcessorContext) {
        for(let processor of this.typeProcessors) {
            const result = processor.consume(swaggerSchemaProperty, typeName, ctx)
            if (result) {
                return result
            }
        }
        ctx.hasErrors = true
        return getErrorType(`Unknown type or property ${JSON.stringify(swaggerSchemaProperty)} ${typeName}`)
    }
}

export type TypeProcessorContext = TypeFactoryContext

export interface TypeProcessor {
    consume: (
        swaggerSchemaProperty: SwaggerSchemaProperty,
        typeName: string,
        ctx: TypeProcessorContext
    ) => PropertyType | null
}

export const defaultTypeProcessors = [
    new LinkTypeProcessor(),
    new ObjectTypeProcessor(),
    new EnumTypeProcessor(),
    new ArrayTypeProcessor(),
    new BasicTypeProcessor()
]
