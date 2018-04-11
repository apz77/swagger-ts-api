import { Method, isEmptyModel, Schema } from '../types';
import { linkMethodStub, methodStub, tabsStub, typeCheckCode } from './tsInterfacesStub';

export interface MethodGeneratorContext {
  hasErrors: boolean;
  tabs: number;
}

export class MethodGenerator {
  private methodTemplate: string;
  private linkMethodTemplate: string;
  private typeCheckCode = typeCheckCode;
  protected apiPrefix = 'Api.';

  constructor(methodTemplate?: string, linkMethodTemplate?: string) {
    this.methodTemplate = methodTemplate || methodStub;
    this.linkMethodTemplate = linkMethodTemplate || linkMethodStub;
  }

  generateMethod(method: Method, ctx: MethodGeneratorContext): string {
    let result = '';
    const paramName = 'request';
    const paramFormName = 'form';
    const requestType = method.request
      ? Array.isArray(method.request)
        ? method.request.map(schema => schema.name).join(' | ')
        : !isEmptyModel(method.request) ? method.request.name : null
      : null;

    const requestMetadatas = method.request && requestType
      ? this.getRequestMetadatas(method.request)
      : null;

    const url = requestType && method.url.includes('{')
      ? `${this.apiPrefix}setParams(${this.apiPrefix}API_URL + \'${method.url}\', ${paramName}, ${requestType}Metadata)`
      : `${this.apiPrefix}API_URL + \'${method.url}\'`;
    const paramsArray = [];

    let headerParams = '';

    if (requestType) {
      paramsArray.push(`${paramName}: ${requestType}`);
      headerParams = paramName;
    }

    if (method.response && method.response === 'link') {

      const methodParam = paramsArray.join(', ');

      result = this.linkMethodTemplate.slice();
      // {{methodName}}
      result = result.replace(/{{methodName}}/g, method.name);

      // {{methodParam}}
      result = result.replace(/{{methodParam}}/g, methodParam);

      // {{headersParams}}
      result = result.replace(/{{headersParams}}/g, headerParams);

      // {{url}}
      result = result.replace(/{{url}}/g, url);

      // {{contentType}}
      result = result.replace(/{{contentType}}/g, 'application/json');

      // {{comment}}
      result = result.replace(/{{comment}}/g, `/**\n  ${method.summary}\n  ${method.description}\n */\n`);

    } else {
      result = this.methodTemplate.slice();
      const resultType =
        method.response
          ? Array.isArray(method.response)
            ? method.response.map(schema => schema.name).join(' | ')
            : (!isEmptyModel(method.response) && method.response && method.response.name) || 'void'
          : 'void';

      let methodFormType: string = '';

      if (method.form && !isEmptyModel(method.form)) {
        methodFormType = method.form.name;
        paramsArray.push(`${paramFormName}: ${methodFormType}`);
      }

      const methodParam = paramsArray.join(', ');

      // {{methodName}}
      result = result.replace(/{{methodName}}/g, method.name);

      // {{methodParam}}
      result = result.replace(/{{methodParam}}/g, methodParam);

      // {{methodResultType}}
      result = result.replace(/{{methodResultType}}/g, resultType);

      // {{headersParams}}
      result = result.replace(/{{headersParams}}/g, headerParams);

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
          : requestType ? `${this.apiPrefix}serialize(${paramName}, ${requestMetadatas})` : 'null');

      // {{contentType}}
      result = result.replace(
        /{{contentType}}/g,
        methodFormType ? 'application/json' : 'multipart/mixed',
      );

      // {{httpMethod}}
      result = result.replace(/{{httpMethod}}/g, method.method);

      // {{typeCheckCode}}
      result = result.replace(/{{typeCheckCode}}/g, this.generateTypeCheck(method.response));

      // {{comment}}
      result = result.replace(/{{comment}}/g, `/**\n  ${method.summary}\n  ${method.description}\n */\n`);
    }

    if (ctx.tabs) {
      result = result.split('\n').map(item => tabsStub.repeat(ctx.tabs) + item).join('\n');
    }

    return result;
  }


  generateTypeCheck(schema: Schema | Schema[] | null) {
    const schemas = Array.isArray(schema) ? schema : [schema];
    if (schemas.length === 0 || (schemas.length === 1 && isEmptyModel(schemas[0]))) {
      return ';';
    }

    return this.typeCheckCode.replace(/{{responseTypeCheckFunction}}/g, schemas
      .map((schema) => {
        return `is${(schema as Schema).name}(decodedResponse)`;
      }). join(' || '));
  }

  getRequestMetadatas(schema: Schema | Schema[]) {
    const schemas = Array.isArray(schema) ? schema : [schema];
    return `[${schemas.map(schema => schema.name + 'Metadata').join(', ')}]`;
  }

}
