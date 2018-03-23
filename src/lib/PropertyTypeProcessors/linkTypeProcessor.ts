import { TypeProcessor, TypeProcessorContext } from "./typePropcessor";
import { BasicType, PropertyType, SwaggerSchemaProperty } from "../types";
import { getErrorType } from "../schemaProperty";

export class LinkTypeProcessor implements TypeProcessor {

    consume(swaggerSchemaProperty: SwaggerSchemaProperty, typeName: string, ctx: TypeProcessorContext): PropertyType | null {

        const name = ctx.propertyName
        const metadata = swaggerSchemaProperty["x-metadata"]

        if (typeName !== "null") {
            if (metadata && metadata.schema) {
                switch (metadata.schema) {
                    case "Permit": return {
                        basicType: BasicType.PERMIT
                    }
                    case "FolderType": return {
                        basicType: BasicType.FOLDERTYPE
                    }
                    default: return {
                        basicType: BasicType.LINK,
                        linkTo: metadata.schema
                    }
                }
            } else {
                if (name.length > 2 && name.substr(-2) === "Id") {
                    ctx.hasErrors = true
                    return getErrorType(`x-metadata with schema required for Link type.`)
                }
            }
        }

        return null
    }
}
