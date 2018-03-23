import { AllSchemas, Schema } from "../types";
import * as fs from "fs"
import { TypeToTsPropertyConverter } from "./TypeToTsPropertyConverter";

export class InterfaceGenerator {
    protected template: string = null

    constructor(templateFileName?: string) {
        const fileName = templateFileName ? templateFileName : "./templates/interfaceTemplate.tst"
        this.template = fs.readFileSync(fileName, {encoding: 'utf8'})
    }

    generate(schema: Schema, allSchemas: AllSchemas): string {
        const typeToTsPropertyConverter = new TypeToTsPropertyConverter(allSchemas)
        let result = this.template.slice()
        // {{name}}
        result = result.replace('{{name}}', schema.name)

        // {{properties}}
        const {properties} = schema
        const propertyNames = Object.keys(properties)

        const interfaceProperties = propertyNames.map((propertyName) => {
                const property = properties[propertyName]
                const types = property.types.map((type) => typeToTsPropertyConverter.convert(type))
                return `    ${property.name}${property.isRequired ? "?" : ""}: ${types.join(" | ")}`
            }
        )


        // {{requiredFields}}
        // {{fieldsMetadata}}

        return result
    }
}
