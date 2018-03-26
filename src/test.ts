import * as request from "request";
import { generateTypescriptIntefacesWithMetadata, parseSwagger } from "./index";
import * as fs from "fs";


const schemaOutFile = 'schema.json'
const interfacesOutFile = 'models.ts'

if (fs.existsSync(schemaOutFile)) {
    fs.unlinkSync(schemaOutFile)
}

if (fs.existsSync(interfacesOutFile)) {
    fs.unlinkSync(interfacesOutFile)
}

request("http://127.0.0.1:3001/docs/swagger.json", (error: any, response: any, body: string) => {
    const responseJson = JSON.parse(body)


    const ctx = {
        hasErrors: false
    }

    const schemas = parseSwagger(responseJson, ctx)

    if (schemas) {
        fs.appendFileSync(schemaOutFile, JSON.stringify(schemas, null, 4))
        fs.appendFileSync(interfacesOutFile, generateTypescriptIntefacesWithMetadata(schemas, ctx))
    }

    console.log(ctx.hasErrors ? "Some errors occured during swagger translation" : "All is good")
    console.log(`Check TS results in ${interfacesOutFile}`)
    console.log(`Swagger parsing result in ${schemaOutFile}`)
})


