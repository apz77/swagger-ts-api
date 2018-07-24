import { AllSchemas } from '../types';
import { InterfaceGenerator } from './interfaceGenerator';
import { defaultIndexTemplate } from './tsInterfacesStub';

export class IndexFileGenerator {

  protected indexTemplate = defaultIndexTemplate;

  constructor(protected interfaceGenerator: InterfaceGenerator) {
  }

  getIndexFileName(): string {
    return 'api';
  }

  generateIndex(schemas: AllSchemas, tags: string[]): string {
    let result = this.indexTemplate.slice();

    result = result.replace(
      /{{commonTypes}}/g,
      `\n${this.interfaceGenerator.generateModelTypes(schemas)}\n export const v0 = void 0;\n`,
    );

    return result;
  }

}
