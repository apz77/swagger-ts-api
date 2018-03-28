import { Method } from "../types";
import { methodStub } from "./tsInterfacesStub";


export class MethodGenerator {
    private methodTemplate: string

    constructor(methodTemplate?: string) {
        this.methodTemplate = methodTemplate || methodStub
    }

    generateMethod(method: Method): string {
        let result = this.methodTemplate.slice()
        const paramName = "request"
        const requestType = method.request && method.request.name
        const resultType = (method.response && method.response.name) || "void"
        const methodParam =  requestType ? `${paramName}: ${requestType}` : ""

        // {{methodName}}
        result = result.replace(/{{methodName}}/g, method.name)

        //{{methodParam}}
        result = result.replace(/{{methodParam}}/g, methodParam)

        //{{methodResultType}}
        result = result.replace(/{{methodResultType}}/g, resultType)

        //{{url}}
        result = result.replace(/{{url}}/g, method.url)

        //{{dataName}}
        result = result.replace(/{{dataName}}/g, methodParam ? paramName : "null")

        //{{httpMethod}}
        result = result.replace(/{{httpMethod}}/g, method.method)

        return result
    }
}
