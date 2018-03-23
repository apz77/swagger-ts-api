import { TypeProcessor, TypeProcessorContext } from "./typePropcessor";
import { BasicType, ObjectProperty, PropertyType, SwaggerSchemaProperty } from "../types";
import { getErorrProperty } from "../schema";

export class ObjectTypeProcessor implements TypeProcessor {

    consume(swaggerSchemaProperty: SwaggerSchemaProperty, typeName: string, ctx: TypeProcessorContext): PropertyType | null {
        if (typeName === "object") {
            if (swaggerSchemaProperty.properties && Object(swaggerSchemaProperty.properties) === swaggerSchemaProperty.properties) {
                const properties: {[key: string]: ObjectProperty} = {}

                for(let propertyName in swaggerSchemaProperty.properties) {
                    const property = ctx.schemaPropertyFactory.translateProperty(
                        propertyName,
                        swaggerSchemaProperty.properties[propertyName],
                        (!!swaggerSchemaProperty.required) && swaggerSchemaProperty.required.indexOf(propertyName) >= 0,
                        ctx
                    )
                    if (property) {
                        properties[propertyName] = property
                    } else {
                        ctx.hasErrors = true
                        properties[propertyName] = getErorrProperty(`Unable to translate Property ${propertyName}`)
                    }
                }

                return {
                    basicType: BasicType.OBJECT,
                    properties
                }
            } else {
                return {
                    basicType: BasicType.OBJECT,
                    properties: []
                }
            }
        }
        return null
    }
}
