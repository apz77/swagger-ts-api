import { AllSchemas, Paths } from '../types';
import { ModuleGenerator } from './moduleGenerator';
import { InterfaceGenerator } from './interfaceGenerator';
import { defaultFileTemplate, defaultIndexTemplate } from './tsInterfacesStub';

export class FileGenerator {

  protected fileTemplate: string;
  protected indexTemplate: string;

  constructor(protected moduleGenerator: ModuleGenerator,
              protected interfaceGenerator: InterfaceGenerator) {
    this.fileTemplate = defaultFileTemplate;
    this.indexTemplate = defaultIndexTemplate;
  }

  generateIndex(schemas: AllSchemas, tags: string[]): string {
    let result = this.indexTemplate.slice();

    result = result.replace(
      /{{files}}/g,
      tags.map(tag => `export * from './${this.getFileName(tag)}';`).join('\n'),
    );

    result = result.replace(
      /{{commonTypes}}/g,
      `\n${this.interfaceGenerator.generateModelTypes(schemas)}\n export const v0 = void 0;\n`,
    );


    return result;
  }

  getIndexFileName(): string {
    return 'api';
  }

  getFileName(tag: string): string {
    return tag.charAt(0).toLocaleLowerCase() + tag.slice(1);
  }

  generate(paths: Paths, schemas: AllSchemas, tag: string, ctx: {hasErrors: boolean}): string {
    let result = this.fileTemplate.slice();
    let interfaceAndMetadata = '';
    let moduleContent = '';

    const newCtx = {
      ...ctx,
      isResponse: false,
      tabs: 0,
    }

    if (schemas[tag]) {
      interfaceAndMetadata = this.interfaceGenerator.generate(schemas[tag], schemas, newCtx) + '\n' +
        this.interfaceGenerator.generateMetadata(schemas[tag], schemas, newCtx) + '\n';
    }

    // {{interface}}
    result = result.replace(
      /{{interface}}/g,
      interfaceAndMetadata,
    );

    if (paths[tag]) {
      moduleContent = this.moduleGenerator.generate(tag, paths[tag], schemas, newCtx);
    }

    // {{module}}
    result = result.replace(
      /{{module}}/g,
      moduleContent,
    );

    return result;
  }
}
