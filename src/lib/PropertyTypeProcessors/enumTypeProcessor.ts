import { getErrorType } from "../schemaProperty";
import { BasicType, PropertyType, SwaggerSchemaProperty } from "../types";
import { TypeProcessor, TypeProcessorContext } from "./typePropcessor";


export class EnumTypeProcessor implements TypeProcessor {

    consume(swaggerSchemaProperty: SwaggerSchemaProperty, typeName: string, ctx: TypeProcessorContext): PropertyType | null {
        if (swaggerSchemaProperty.enum) {
            if (typeName === "string") {
                return {
                    basicType: BasicType.ENUM,
                    values: swaggerSchemaProperty.enum
                }
            } else if (typeName === "null") {
                return {
                    basicType: BasicType.NULL
                }
            }
            ctx.hasErrors = true
            return getErrorType(`Property is enum, but basic type is not string|null ${typeName}`)
        }

        return null
    }

}
