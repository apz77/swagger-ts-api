import { AllSchemas, ArrayType, BasicType, LinkType, ObjectProperty, Schema } from "../types";
import { TypeToTsPropertyConverter, TypeToTsPropertyConverterContext } from "./TypeToTsPropertyConverter";

export interface InterfaceGeneratorContext {
    hasErrors: boolean
}

export class InterfaceGenerator {
    protected template: string
    protected metadataTemplate: string

    constructor(template?: string) {
        this.template = template
            ? template
            : "\n" +
            "export interface {{name}} extends BaseModel {\n" +
            "{{properties}}\n" +
            "}\n" +
            "\n" +
            "export module {{name}}Metadata {\n" +
            "\n" +
            "    const type = \"{{name}}\"\n" +
            "    const emptyModel: {{name}} = {{{emptyModelFields}}}\n" +
            "\n" +
            "    Object.freeze(emptyModel)\n" +
            "\n" +
            "    export module fields {\n" +
            "{{fieldsMetadata}}\n" +
            "    }\n" +
            "}\n"

        this.metadataTemplate =
            "       export const {{name}} = {\n" +
            "           name: \"{{name}}\",\n" +
            "           types: {{types}},\n" +
            "           subType: \"{{subType}}\",\n" +
            "           isRequired: {{isRequired}},\n" +
            "           apiField: \"{{apiField}}\"\n" +
            "       }\n"
    }


    generateModelTypes(allSchemas: AllSchemas): string {
        return `export type ModelTypes = ${Object.keys(allSchemas).map((schemaName) => `\"${schemaName}\"`).join(" | ")}\n`
    }

    generate(schema: Schema, allSchemas: AllSchemas, ctx: InterfaceGeneratorContext): string {
        const typeToTsPropertyConverter = new TypeToTsPropertyConverter(allSchemas)
        let result = this.template.slice()
        // {{name}}
        result = result.replace(/{{name}}/g, schema.name)

        // {{properties}}
        const {properties} = schema
        const propertyNames = Object.keys(properties)

        const newCtx = Object.assign({
            howDeepIsYourLove: 1,
            schema: schema
        }, ctx)

        const interfaceProperties = propertyNames.map((propertyName) => {
                const property = properties[propertyName]
                const types = property.types.map((type) => typeToTsPropertyConverter.convert(type, newCtx))
                return `    ${getPropertyName(property, newCtx)}${property.isRequired ? "" : "?"}: ${types.join(" | ")}`
            }
        )

        result = result.replace(/{{properties}}/g, interfaceProperties.join("\n"))

        // {{emptyModelFields}}
        const requiredFields = propertyNames
            .filter((propertyName) => properties[propertyName].isRequired)
            .map((propertyName) => `${getPropertyName(properties[propertyName], newCtx)}: v0`)

        requiredFields.unshift(`type: \"${schema.name}\"`)
        result = result.replace(/{{emptyModelFields}}/g, requiredFields.join(","))

        // {{fieldsMetadata}}
        const fieldsMetadata = propertyNames
            .map((propertyName) => {
                const property = properties[propertyName]
                let template = this.metadataTemplate.slice()
                template = template.replace(/{{name}}/g, getPropertyName(property, newCtx))
                template = template.replace(/{{types}}/g, this.getPropertyMetadataTypes(property))
                template = template.replace(/{{subType}}/g, this.getPropertyMetadataSubType(property))
                template = template.replace(/{{isRequired}}/g, `${property.isRequired}`)
                template = template.replace(/{{apiField}}/g, propertyName)
                return template
            })
            .join("")

        result = result.replace(/{{fieldsMetadata}}/g, fieldsMetadata)

        ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors

        return result
    }

    protected getPropertyMetadataTypes(property: ObjectProperty): string {
        return `[${property.types.map((type) => `\"${type.basicType}\"`).join(", ")}]`
    }

    protected getPropertyMetadataSubType(property: ObjectProperty): string {
        let linkType = property.types.find((type) => type.basicType === BasicType.LINK) as LinkType
        if (linkType) {
            return linkType.linkTo
        }

        let arrayType = property.types.find((type) => type.basicType === BasicType.ARRAY) as ArrayType
        if (arrayType) {
            if (arrayType.arrayType.basicType === BasicType.LINK) {
                return (arrayType.arrayType as LinkType).linkTo
            } else {
                return arrayType.arrayType.basicType
            }
        }


        return ""
    }
}



export function getPropertyName(property: ObjectProperty, ctx: TypeToTsPropertyConverterContext) {
    if (property.types.find((type) => type.basicType === BasicType.LINK)) {
        if (property.name.substr(-2) === "Id") {
            return property.name.substr(0, property.name.length - 2)
        }
        console.log(`Property ${ctx.schema.name}.${property.name} is a link, but does not end with Id.`)
    }
    return property.name
}
