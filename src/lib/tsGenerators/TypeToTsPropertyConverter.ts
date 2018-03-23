import { AllSchemas, ArrayType, BasicType, EnumType, ErrorType, LinkType, PropertyType } from "../types";

export interface TypeToTsPropertyConverterContext {
    hasError: boolean
}

export class TypeToTsPropertyConverter {
    protected basicTypesMap: {[key: number]: string} = {
        [BasicType.NULL]: "null",
        [BasicType.STRING]: "string",
        [BasicType.NUMBER]: "number",
        [BasicType.BOOLEAN]: "boolean",
        [BasicType.DATE]: "DateOnly",
        [BasicType.DATETIME]: "DateTime",
        [BasicType.HOSTNAME]: "Hostname",
        [BasicType.EMAIL]: "Email",
        [BasicType.PERMIT]: "Permit",
        [BasicType.FOLDERTYPE]: "FolderType",
        [BasicType.JSON]: "string",
    }

    constructor(protected allSchemas: AllSchemas) {}

    public convert(type: PropertyType, ctx: TypeToTsPropertyConverterContext) {
        if (this.basicTypesMap[type.basicType]) {
            return this.basicTypesMap[type.basicType]
        }

        switch (type.basicType) {
            case BasicType.ARRAY: return `${this.convert((type as ArrayType).arrayType, ctx)}[]`
            case BasicType.OBJECT: return 
            case BasicType.ENUM: return (type as EnumType).values.map((val) => `"${val}"`).join(" | ")
            case BasicType.LINK: if (this.allSchemas[(type as LinkType).linkTo]) {
                return (type as LinkType).linkTo
            } else {
                ctx.hasError = true
                const error = `ErrorType(model ${(type as LinkType).linkTo} has not been found in swagger doc)`
                console.error(error)
                return error
            }
            case BasicType.ERROR: return `ErrorType(${(type as ErrorType).error})`
        }
    }
}
