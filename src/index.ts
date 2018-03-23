import * as request from "request"
import * as fs from "fs"

import { SchemaFactory } from "./lib/schema";
import { SchemaPropertyFactory } from "./lib/schemaProperty";
import { DefaultPropertyProcessor } from "./lib/PropertyProcessor/defaultPropertyProcessor";
import { defaultTypeProcessors, TypeFactory } from "./lib/PropertyTypeProcessors/typePropcessor";
import { AllSchemas } from "./lib/types";

if (fs.existsSync('output.js')) {
    fs.unlinkSync('output.js')
}

request("http://127.0.0.1:3001/docs/swagger.json", (error: any, response: any, body: string) => {
    const responseJson = JSON.parse(body)

    const schemaFactory = new SchemaFactory(
        new SchemaPropertyFactory(
            [
                new DefaultPropertyProcessor(
                    new TypeFactory(defaultTypeProcessors)
                )
            ]
        )
    )

    const ctx = {
        hasErrors: false
    }

    const schemas: AllSchemas = {}


    for(let schemaName in responseJson.components.schemas) {
        schemas[schemaName] = schemaFactory.translateSchema(schemaName, responseJson.components.schemas[schemaName], ctx)
    }

    console.log(ctx.hasErrors ? "Some errors occured during swagger translation" : "All is good")
})

