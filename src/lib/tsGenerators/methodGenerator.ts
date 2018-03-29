import { Method, isEmptyModel } from '../types';
import { linkMethodStub, methodStub, tabsStub } from "./tsInterfacesStub";

export interface MethodGeneratorContext {
  hasErrors: boolean;
  tabs: number;
}

export class MethodGenerator {
  private methodTemplate: string;
  private linkMethodTemplate: string;

  constructor(methodTemplate?: string, linkMethodTemplate?: string) {
    this.methodTemplate = methodTemplate || methodStub;
    this.linkMethodTemplate = linkMethodTemplate || linkMethodStub;
  }

  generateMethod(method: Method, ctx: MethodGeneratorContext): string {
    let result = ''
    const paramName = 'request';
    const requestType = method.request && method.request.name;
    const methodParam =  !isEmptyModel(method.request) ? `${paramName}: ${requestType}` : '';

    const url = '${substituteParams({{url}}, {{methodParamName}}, {{methodParamMetadata}})}'

    if (method.response && method.response === 'link') {
      const methodParam =  !isEmptyModel(method.request) ? `${paramName}: ${requestType}` : '';

      result = this.linkMethodTemplate.slice();
      // {{methodName}}
      result = result.replace(/{{methodName}}/g, method.name);

      // {{methodParam}}
      result = result.replace(/{{methodParam}}/g, methodParam);

      // {{methodParam}}
      result = result.replace(/{{methodParamName}}/g, paramName);

      // {{url}}
      result = result.replace(/{{url}}/g, url);

      // {{methodParamMetadata}}
      result = result.replace(/{{methodParamMetadata}}/g, `${requestType}Metadata`);


    } else {
      result = this.methodTemplate.slice();
      const resultType = (!isEmptyModel(method.response) && method.response && method.response.name) || 'void';

      // {{methodName}}
      result = result.replace(/{{methodName}}/g, method.name);

      // {{methodParam}}
      result = result.replace(/{{methodParam}}/g, methodParam);

      // {{methodParam}}
      result = result.replace(/{{methodParamName}}/g, paramName);

      // {{methodParamMetadata}}
      result = result.replace(/{{methodParamMetadata}}/g, `${requestType}Metadata`);

      // {{methodResultType}}
      result = result.replace(/{{methodResultType}}/g, resultType);

      // {{url}}
      result = result.replace(/{{url}}/g, url);

      // {{dataName}}
      result = result.replace(/{{body}}/g, methodParam ? `JSON.stringify(${paramName})` : 'null');

      // {{httpMethod}}
      result = result.replace(/{{httpMethod}}/g, method.method);

      if (ctx.tabs) {
        result = result.split('\n').map(item => tabsStub.repeat(ctx.tabs) + item).join('\n');
      }
    }

    return result;
  }

}
