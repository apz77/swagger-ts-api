import { InterfaceGenerator } from "./interfaceGenerator";
import { MethodGenerator } from "./methodGenerator";
import { AllSchemas, Method } from "../types";
import { defaultMethodTemplate, defaultModuleTemplate } from "./tsInterfacesStub";

export interface ModuleGeneratorContext {
    hasErrors: boolean,
    tabs?: number
}

export class ModuleGenerator {

    protected methodTemplate: string
    protected moduleTemplate: string

    constructor(protected interfaceGenerator: InterfaceGenerator,
                protected methodGenerator: MethodGenerator,
                methodTemplate?: string,
                moduleTemplate?: string) {

        this.methodTemplate = methodTemplate || defaultMethodTemplate
        this.moduleTemplate = moduleTemplate || defaultModuleTemplate
    }

    public generateModule(moduleName: string, methods: Method[], allSchemas: AllSchemas, ctx: ModuleGeneratorContext): string {
        let result = this.moduleTemplate.slice()
        const tabs = typeof ctx.tabs === "number" ? ctx.tabs : 0
        if (tabs) {
            result = result.split("\n").map((item) => "    ".repeat(tabs) + item).join("\n")
        }

        const allMethods = methods.map((method) => {
            let result = this.methodTemplate.slice()
            const tabs = ctx.tabs ? ctx.tabs + 1 : 1
            result = result.split("\n").map((item) => "    ".repeat(tabs) + item).join("\n")
            const newCtx = {
                ...ctx,
                tabs: tabs + 1
            }

            //{{method}}
            result = result.replace(
                /{{method}}/g,
                this.methodGenerator.generateMethod(method)
            )

            //"{{requestInterface}}
            result = result.replace(
                /{{requestInterface}}/g,
                method.request ? this.interfaceGenerator.generate(method.request, allSchemas, newCtx) : ""
            )

            //"{{responseInterface}}
            result = result.replace(
                /{{responseInterface}}/g,
                method.response ? this.interfaceGenerator.generate(method.response, allSchemas, newCtx) : ""
            )

            //"{{requestMetadata}}
            result = result.replace(
                /{{requestMetadata}}/g,
                method.request ? this.interfaceGenerator.generateMetadata(method.request, allSchemas, newCtx) : ""
            )

            //"{{responseMetadata}}
            result = result.replace(
                /{{responseMetadata}}/g,
                method.response ? this.interfaceGenerator.generateMetadata(method.response, allSchemas, newCtx) : ""
            )

            ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors

            return result
        }).join("\n")

        result = result.replace(
            /{{ModuleName}}/g,
            moduleName
        )

        //"{{allMethods}}
        result = result.replace(
            /{{allMethods}}/g,
            allMethods
        )

        return result
    }
}
