import { Method, isEmptyModel } from '../types';
import { linkMethodStub, methodStub, tabsStub } from './tsInterfacesStub';

export interface MethodGeneratorContext {
  hasErrors: boolean;
  tabs: number;
}

export class MethodGenerator {
  private methodTemplate: string;
  private linkMethodTemplate: string;
  protected apiPrefix = 'Api.';

  constructor(methodTemplate?: string, linkMethodTemplate?: string) {
    this.methodTemplate = methodTemplate || methodStub;
    this.linkMethodTemplate = linkMethodTemplate || linkMethodStub;
  }

  generateMethod(method: Method, ctx: MethodGeneratorContext): string {
    let result = '';
    const paramName = 'request';
    const paramFormName = 'form';
    const requestType = method.request && method.request.name;
    const url = !isEmptyModel(method.request)
      ? `${this.apiPrefix}setParams(${this.apiPrefix}API_URL + \'${method.url}\', ${paramName}, ${requestType}Metadata)`
      : `${this.apiPrefix}API_URL + \'${method.url}\'`;
    const paramsArray = [];

    if (!isEmptyModel(method.request)) {
      paramsArray.push(`${paramName}: ${requestType}`);
    }

    if (method.response && method.response === 'link') {

      const methodParam = paramsArray.join(', ');

      result = this.linkMethodTemplate.slice();
      // {{methodName}}
      result = result.replace(/{{methodName}}/g, method.name);

      // {{methodParam}}
      result = result.replace(/{{methodParam}}/g, methodParam);

      // {{url}}
      result = result.replace(/{{url}}/g, url);

      // {{contentType}}
      result = result.replace(/{{contentType}}/g, 'application/json');

      // {{comment}}
      result = result.replace(/{{comment}}/g, `/** ${method.summary}\n    ${method.description} */\n`);


    } else {
      result = this.methodTemplate.slice();
      const resultType = (!isEmptyModel(method.response) && method.response && method.response.name) || 'void';
      let methodFormType: string = '';

      if (method.form && !isEmptyModel(method.form)) {
        methodFormType = method.form.name
        paramsArray.push(`${paramFormName}: ${methodFormType}`);
      }

      const methodParam = paramsArray.join(', ');

      // {{methodName}}
      result = result.replace(/{{methodName}}/g, method.name);

      // {{methodParam}}
      result = result.replace(/{{methodParam}}/g, methodParam);

      // {{methodResultType}}
      result = result.replace(/{{methodResultType}}/g, resultType);

      // {{url}}
      result = result.replace(/{{url}}/g, url);

      // {{formPrepare}}
      let formPrepare = methodFormType
        ? 'const formData = new FormData();\n' +
          `for (const key in ${paramFormName}) {\n` +
          `  formData.append(key, (${paramFormName} as {[key: string]: any})[key]);\n` +
          '}\n'
        : '';

      if (ctx.tabs && formPrepare) {
        formPrepare = formPrepare.split('\n').map(item => tabsStub.repeat(ctx.tabs) + item).join('\n');
      }

      result = result.replace(/{{formPrepare}}/g, formPrepare);

      // {{body}}
      result = result.replace(
        /{{body}}/g,
        methodFormType
          ? 'formData'
          : !isEmptyModel(method.request) ? `JSON.stringify(${paramName})` : 'null');

      // {{contentType}}
      result = result.replace(
        /{{contentType}}/g,
        methodFormType ? 'application/json' : 'multipart/mixed',
      );

      // {{httpMethod}}
      result = result.replace(/{{httpMethod}}/g, method.method);

      // {{comment}}
      result = result.replace(/{{comment}}/g, `/** ${method.summary}\n    ${method.description} */\n`);

      if (ctx.tabs) {
        result = result.split('\n').map(item => tabsStub.repeat(ctx.tabs) + item).join('\n');
      }
    }

    return result;
  }

}
