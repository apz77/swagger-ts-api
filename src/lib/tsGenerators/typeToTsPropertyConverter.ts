import {
    AllSchemas, ArrayType, BasicType, EnumType, ErrorType, LinkType, ObjectType,
    PropertyType, Schema
} from "../types";
import { getPropertyName, InterfaceGeneratorContext } from "./interfaceGenerator";

export interface TypeToTsPropertyConverterContext extends InterfaceGeneratorContext {
    schema: Schema
    tabs: number
}

export class TypeToTsPropertyConverter {

    protected basicTypesMap: {[key: string]: string} = {
        [BasicType.NULL]: "null",
        [BasicType.STRING]: "string",
        [BasicType.NUMBER]: "number",
        [BasicType.BOOLEAN]: "boolean",
        [BasicType.DATE]: "DateOnly",
        [BasicType.DATETIME]: "DateTime",
        [BasicType.HOSTNAME]: "Hostname",
        [BasicType.DURATION]: "Duration",
        [BasicType.EMAIL]: "Email",
        [BasicType.PERMIT]: "Permit",
        [BasicType.FOLDERTYPE]: "FolderType",
        [BasicType.INVITATIONSTATUS]: "InvitationStatus",
        [BasicType.JSON]: "string",
    }

    constructor(protected allSchemas: AllSchemas) {}

    public convert(type: PropertyType, ctx: TypeToTsPropertyConverterContext): any {
        if (this.basicTypesMap[type.basicType]) {
            return this.basicTypesMap[type.basicType]
        }

        const nextCtx = {
            ...ctx,
            tabs: ctx.tabs + 1
        }

        switch (type.basicType) {
            case BasicType.MODELTYPE: return "ModelTypes"
            case BasicType.MODELID: return "string"
            case BasicType.ARRAY: return `Array<${this.convert((type as ArrayType).arrayType, nextCtx)}>`
            case BasicType.OBJECT: return this.convertObject(type as ObjectType, nextCtx)
            case BasicType.ENUM: return (type as EnumType).values.map((val) => `"${val}"`).join(" | ")
            case BasicType.LINK: if (this.allSchemas[(type as LinkType).linkTo]) {
                return (type as LinkType).linkTo
            } else {
                ctx.hasErrors = true
                const error = `${ctx.schema.name} ErrorType(model ${(type as LinkType).linkTo} has not been found in swagger doc)`
                console.error(error)
                return error
            }
            case BasicType.ERROR: return `ErrorType(${(type as ErrorType).error})`
        }
    }

    protected convertObject(type: ObjectType, ctx: TypeToTsPropertyConverterContext) {
        const {properties} = type
        const objectInterface = Object.keys(properties).map((propertyName: string) => {
            const property = properties[propertyName]
            const types = property.types.map((subType) => this.convert(subType, ctx))
            return `${"    ".repeat(ctx.tabs + 1)}${getPropertyName(property, ctx)}${property.isRequired ? "" : "?"}: ${types.join(" | ")}`
        }).join("\n")

        return `{\n${objectInterface}\n${"    ".repeat(ctx.tabs)}}`
    }
}
