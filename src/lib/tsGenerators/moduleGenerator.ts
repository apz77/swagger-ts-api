import { InterfaceGenerator } from './interfaceGenerator';
import { MethodGenerator } from './methodGenerator';
import { AllSchemas, Method } from '../types';
import { defaultMethodTemplate, defaultModuleTemplate } from './tsInterfacesStub';

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

    this.methodTemplate = methodTemplate || defaultMethodTemplate;
    this.moduleTemplate = moduleTemplate || defaultModuleTemplate;
  }

  public generateModule(moduleName: string,
                        methods: Method[],
                        allSchemas: AllSchemas,
                        ctx: ModuleGeneratorContext): string {
    let result = this.moduleTemplate.slice();
    const tabs = typeof ctx.tabs === 'number' ? ctx.tabs : 0;
    if (tabs) {
      result = result.split('\n').map((item) => '    '.repeat(tabs) + item).join('\n');
    }

    const allMethods = methods.map((method) => {
            let methodResult = this.methodTemplate.slice();
            const tabs = ctx.tabs ? ctx.tabs + 1 : 1;
            methodResult = methodResult.split('\n').map((item) => '    '.repeat(tabs) + item).join('\n');
            const newCtx = {
                ...ctx,
                tabs: tabs + 1,
            };

            // {{method}}
            methodResult = methodResult.replace(
                /{{method}}/g,
                this.methodGenerator.generateMethod(method),
            );

            // {{requestInterface}}
            methodResult = methodResult.replace(
                /{{requestInterface}}/g,
                method.request ? this.interfaceGenerator.generate(method.request, allSchemas, newCtx) : '',
            );

            // {{responseInterface}}
            methodResult = methodResult.replace(
                /{{responseInterface}}/g,
                method.response ? this.interfaceGenerator.generate(method.response, allSchemas, newCtx) : '',
            );

            // {{requestMetadata}}
            methodResult = methodResult.replace(
                /{{requestMetadata}}/g,
                method.request ? this.interfaceGenerator.generateMetadata(method.request, allSchemas, newCtx) : '',
            );

            // {{responseMetadata}}
            methodResult = methodResult.replace(
                /{{responseMetadata}}/g,
                method.response ? this.interfaceGenerator.generateMetadata(method.response, allSchemas, newCtx) : '',
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

    return result;
  }
}
