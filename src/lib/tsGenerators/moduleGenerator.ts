import { InterfaceGenerator } from './interfaceGenerator';
import { MethodGenerator } from './methodGenerator';
import { AllSchemas, isEmptyModel, Method } from '../types';
import { defaultModuleMethodTemplate, defaultModuleTemplate, tabsStub } from './tsInterfacesStub';

export interface ModuleGeneratorContext {
  hasErrors: boolean;
  tabs?: number;
}

export class ModuleGenerator {

  protected methodTemplate: string;
  protected moduleTemplate: string;

  constructor(protected interfaceGenerator: InterfaceGenerator,
              protected methodGenerator: MethodGenerator,
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

    const allMethods = methods.map((method) => {
          let methodResult = this.methodTemplate.slice();

          const newCtx = {
              ...ctx,
              tabs: tabs + 1,
          };

          // {{method}}
          methodResult = methodResult.replace(
              /{{method}}/g,
              this.methodGenerator.generateMethod(method, newCtx) + '\n',
          );

          // {{requestInterface}}
          methodResult = methodResult.replace(
              /{{requestInterface}}/g,
              !isEmptyModel(method.request) && method.request
                ? this.interfaceGenerator.generate(method.request, allSchemas, newCtx) + '\n'
                : '',
          );

          // {{requestInterface}}
          methodResult = methodResult.replace(
            /{{formInterface}}/g,
            !isEmptyModel(method.form) && method.form
              ? this.interfaceGenerator.generate(method.form, allSchemas, newCtx) + '\n'
              : '',
          );


          // {{responseInterface}}
          methodResult = methodResult.replace(
              /{{responseInterface}}/g,
              !isEmptyModel(method.response) && method.response && method.response !== 'link'
                ? this.interfaceGenerator.generate(method.response, allSchemas, newCtx) + '\n'
                : '',
          );

          // {{requestMetadata}}
          methodResult = methodResult.replace(
              /{{requestMetadata}}/g,
              !isEmptyModel(method.request) && method.request
                ? this.interfaceGenerator.generateMetadata(method.request, allSchemas, newCtx) + '\n'
                : '',
          );

          // {{formMetadata}}
          methodResult = methodResult.replace(
            /{{formMetadata}}/g,
            method.form &&!isEmptyModel(method.form)
              ? this.interfaceGenerator.generateMetadata(method.form, allSchemas, newCtx) + '\n'
              : '',
          );


          // {{responseMetadata}}
          methodResult = methodResult.replace(
              /{{responseMetadata}}/g,
              !isEmptyModel(method.response) && method.response && method.response !== 'link'
                ? this.interfaceGenerator.generateMetadata(method.response, allSchemas, newCtx) + '\n'
                : '',
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

    if (tabs) {
      result = result.split('\n').map(item => tabsStub.repeat(tabs) + item).join('\n');
    }

    return result;
  }
}
