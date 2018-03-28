import { BasicType, PropertyType, SwaggerSchemaProperty } from "../types";
import { TypeProcessor, TypeProcessorContext } from "./typePropcessor";
import { getErrorType } from "../schemaProcessor/schemaProperty";


export class ArrayTypeProcessor implements TypeProcessor {

    consume(swaggerSchemaProperty: SwaggerSchemaProperty, typeName: string, ctx: TypeProcessorContext): PropertyType | null
    {
        if (typeName === "array") {
            const metadata = swaggerSchemaProperty["x-metadata"]
            if (metadata && metadata.schema) {
                return {
                    basicType: BasicType.ARRAY,
                    arrayType: {
                        basicType: BasicType.LINK,
                        linkTo: metadata.schema
                    }
                }
            } else if (swaggerSchemaProperty.items && (typeof swaggerSchemaProperty.items.type === 'string')) {
                return {
                    basicType: BasicType.ARRAY,
                    arrayType: ctx.typeFactory.translateType(swaggerSchemaProperty.items, swaggerSchemaProperty.items.type, ctx)
                }
            } else {
                ctx.hasErrors = true
                return getErrorType(`No item for array type defined.`)
            }
        }

        return null
    }
}
