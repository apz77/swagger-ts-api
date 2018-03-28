import * as request from "request";
import { generateTypescriptIntefacesWithMetadata, generateTypeScriptModule, parseSwagger } from "./index";
import * as fs from "fs";
import { InterfaceGenerator } from "./lib/tsGenerators/interfaceGenerator";

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
        hasErrors: false,
        tabs: 0,
    }

    const schemasAndPaths = parseSwagger(responseJson, ctx)

    if (schemasAndPaths) {
        fs.appendFileSync(schemaOutFile, JSON.stringify(schemasAndPaths, null, 4))

        //const interfaceGenerator = new InterfaceGenerator()
        //fs.appendFileSync(interfacesOutFile, interfaceGenerator.generate(schemasAndPaths.schemas["File"], schemasAndPaths.schemas, ctx))
        fs.appendFileSync(interfacesOutFile, generateTypescriptIntefacesWithMetadata(schemasAndPaths.schemas, ctx))
        fs.appendFileSync(interfacesOutFile, generateTypeScriptModule(schemasAndPaths.paths, schemasAndPaths.schemas, ctx))
    }

    console.log(ctx.hasErrors ? "Some errors occured during swagger translation" : "All is good")
    console.log(`Check TS results in ${interfacesOutFile}`)
    console.log(`Swagger parsing result in ${schemaOutFile}`)
})


