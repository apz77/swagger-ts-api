import { Method, isEmptyModel, Schema } from '../types';
import { linkMethodStub, methodStub, tabsStub } from './tsInterfacesStub';

export interface MethodGeneratorContext {
  tag: string;
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
      paramsArray.push(`${paramName}: ${ctx.tag}.${requestType}`);
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
            ? method.response.map(schema => ctx.tag + '.' + schema.name).join(' | ')
            : (!isEmptyModel(method.response) && method.response && (ctx.tag + '.' + method.response.name)) || 'void'
          : 'void';

      let methodFormType: string = '';

      if (method.form && !isEmptyModel(method.form)) {
        methodFormType = method.form.name;
        paramsArray.push(`${paramFormName}: ${ctx.tag}.${methodFormType}`);
      }

      const methodParam = paramsArray.join(', ');

      // {{methodName}}
      result = result.replace(/{{apiPrefix}}/g, this.apiPrefix);

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

      if (formPrepare) {
        formPrepare = formPrepare.split('\n').map(item => tabsStub.repeat(ctx.tabs + 1) + item).join('\n');
      }

      result = result.replace(/{{formPrepare}}/g, formPrepare);

      if (formPrepare) {
        result = result.replace(/{{formData}}/g, 'formData');
      } else {
        result = result.replace(/{{formData}}/g, 'null');
      }

      // {{body}}
      result = result.replace(
        /{{body}}/g,
        requestType && (method.method === 'post' || method.method === 'put')
            ? `${this.apiPrefix}serialize(${paramName}, ${requestMetadatas})`
            : 'null',
      );

      // {{contentType}}
      result = result.replace(
        /{{contentType}}/g,
        methodFormType ? 'application/json' : 'multipart/mixed',
      );

      // {{httpMethod}}
      result = result.replace(/{{httpMethod}}/g, method.method);

      // {{typeCheckCode}}
      result = result.replace(/{{responseTypeCheckFunction}}/g, this.generateTypeCheck(method.response, ctx.tag));

      // {{comment}}
      result = result.replace(/{{comment}}/g, `/**\n  ${method.summary}\n  ${method.description}\n */\n`);
    }

    if (ctx.tabs) {
      result = result.split('\n').map(item => tabsStub.repeat(ctx.tabs) + item).join('\n');
    }

    return result;
  }


  generateTypeCheck(schema: Schema | Schema[] | null, tag: string) {
    const schemas = Array.isArray(schema) ? schema : [schema];
    if (schemas.length === 0 || (schemas.length === 1 && isEmptyModel(schemas[0]))) {
      return 'null';
    }

    return '[' + schemas.map((schema) => {
      return `${tag}.is${(schema as Schema).name}`;
    }). join(', ') + ']';
  }

  getRequestMetadatas(schema: Schema | Schema[]) {
    const schemas = Array.isArray(schema) ? schema : [schema];
    return `[${schemas.map(schema => schema.name + 'Metadata').join(', ')}]`;
  }

}
