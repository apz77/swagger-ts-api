import { InterfaceGenerator, InterfaceGeneratorContext } from './interfaceGenerator';
import { MethodGenerator } from './methodGenerator';
import { AllSchemas, isEmptyModel, Method, Schema } from '../types';
import { defaultModuleMethodTemplate, defaultModuleTemplate, tabsStub } from './tsInterfacesStub';
import { TypeCheckGenerator } from './typeCheckGenerator';
import { IndexFileGenerator } from './indexFileGenerator';

export interface ModuleGeneratorContext {
  hasErrors: boolean;
  tabs: number;
}

export class ModuleGenerator {

  protected methodTemplate: string;
  protected moduleTemplate: string;

  constructor(protected interfaceGenerator: InterfaceGenerator,
              protected methodGenerator: MethodGenerator,
              protected typeCheckGenerator: TypeCheckGenerator,
              protected indexFileGenerator: IndexFileGenerator,
              methodTemplate?: string,
              moduleTemplate?: string) {

    this.methodTemplate = methodTemplate || defaultModuleMethodTemplate;
    this.moduleTemplate = moduleTemplate || defaultModuleTemplate;
  }

  public generate(moduleName: string,
                  methods: Method[],
                  allSchemas: AllSchemas,
                  ctx: ModuleGeneratorContext): string {
    let result = this.moduleTemplate.slice();
    const tabs = typeof ctx.tabs === 'number' ? ctx.tabs : 0;

    const newCtx = {
      ...ctx,
      usedTypes: {},
      isResponse: false,
      tabs: tabs + 1,
    };

    const allMethods = methods.map((method) => {
      let methodResult = this.methodTemplate.slice();

      // {{method}}
      methodResult = methodResult.replace(
        /{{method}}/g,
        this.methodGenerator.generateMethod(method, { ...ctx, tag: `${moduleName}Types` }) + '\n',
      );

      // {{requestMetadata}}
      methodResult = methodResult.replace(
        /{{requestMetadata}}/g,
        this.generateSchemasMetadata(method.request, allSchemas, newCtx),
      );

      // {{formMetadata}}
      methodResult = methodResult.replace(
        /{{formMetadata}}/g,
        method.form && !isEmptyModel(method.form)
          ? this.interfaceGenerator.generateMetadata(method.form, allSchemas, newCtx) + '\n'
          : '',
      );

      // {{responseMetadata}}
      methodResult = methodResult.replace(
        /{{responseMetadata}}/g,
        this.generateSchemasMetadata(method.response, allSchemas, { ...newCtx, isResponse: true }),
      );



      ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;

      return methodResult;
    }).join('\n');

    result = result.replace(
            /{{ModuleName}}/g,
            moduleName,
        );

    // {{allMethods}}
    result = result.replace(
            /{{allMethods}}/g,
            allMethods,
        );

    // {{imports}}
    result = result.replace(
      /{{imports}}/g,
      `import * as ${moduleName}Types from './${moduleName.charAt(0).toLocaleLowerCase() + moduleName.slice(1)}';`,
    );

    // {{indexImport}}
    result = result.replace(
      /{{indexImport}}/g,
      `import * as Api from './${this.indexFileGenerator.getIndexFileName()}';`,
    );

    if (tabs) {
      result = result.split('\n').map(item => tabsStub.repeat(tabs) + item).join('\n');
    }

    return result;
  }


  generateMethodTypes(method: Method, allSchemas: AllSchemas, ctx: InterfaceGeneratorContext): string {

    let result = '';

    // {{requestInterface}}
    result += this.generateSchemasAndTypecheck(method.request, allSchemas, ctx);

    // {{requestInterface}}
    result += !isEmptyModel(method.form) && method.form
        ? this.interfaceGenerator.generate(method.form, allSchemas, ctx) + '\n\n' +
          this.typeCheckGenerator.generate(method.form, ctx) + '\n'
        : '';

    // {{responseInterface}}
    result += this.generateSchemasAndTypecheck(method.response, allSchemas, { ...ctx, isResponse: true });

    return result;
  }


  generateSchemasAndTypecheck(schema: Schema | Schema[] | null | 'link',
                              allSchemas: AllSchemas,
                              ctx: InterfaceGeneratorContext): string {
    const schemas = Array.isArray(schema) ? schema : [schema];
    return schemas
      .filter(schema => !!schema && schema !== 'link')
      .map((schema) => {
        return !isEmptyModel(schema) && schema
          ? this.interfaceGenerator.generate(schema as Schema, allSchemas, ctx) + '\n\n' +
            this.typeCheckGenerator.generate(schema as Schema, ctx) + '\n'
          : '';
      }).join('\n');
  }

  generateSchemasMetadata(schema: Schema | Schema[] | null | 'link',
                          allSchemas: AllSchemas,
                          ctx: InterfaceGeneratorContext): string {

    const schemas = Array.isArray(schema) ? schema : [schema];
    return schemas
      .filter(schema => !!schema && schema !== 'link')
      .map((schema) => {
        return !isEmptyModel(schema)
            ? this.interfaceGenerator.generateMetadata(schema as Schema, allSchemas, ctx)
            : '';
      }).join('\n');

  }

  getFilename(tag: string): string {
    return tag.charAt(0).toLocaleLowerCase() + tag.slice(1) + 'Methods';
  }


}
