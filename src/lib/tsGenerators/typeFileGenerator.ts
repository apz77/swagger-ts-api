import { AllSchemas, Paths } from '../types';
import { ModuleGenerator } from './moduleGenerator';
import { InterfaceGenerator } from './interfaceGenerator';
import { defaultTypeFileTemplate } from './tsInterfacesStub';
import { TypeCheckGenerator } from './typeCheckGenerator';
import { IndexFileGenerator } from './indexFileGenerator';

export class TypeFileGenerator {

  protected typesTemplate: string;

  constructor(protected moduleGenerator: ModuleGenerator,
              protected interfaceGenerator: InterfaceGenerator,
              protected typeCheckGenerator: TypeCheckGenerator,
              protected indexFileGenerator: IndexFileGenerator) {
    this.typesTemplate = defaultTypeFileTemplate;
  }

  getFileName(tag: string): string {
    return tag.charAt(0).toLocaleLowerCase() + tag.slice(1);
  }

  generate(paths: Paths, schemas: AllSchemas, tag: string, ctx: {hasErrors: boolean, rawTypes: boolean}): string {
    let result = this.typesTemplate.slice();
    let interfaces = '';

    const newCtx = {
      ...ctx,
      usedTypes: {},
      isResponse: false,
      tabs: 0,
    }

    if (schemas[tag]) {
      interfaces +=
        this.interfaceGenerator.generate(schemas[tag], schemas, newCtx) + '\n\n' +
        this.typeCheckGenerator.generate(schemas[tag], newCtx) + '\n\n';
    }

    if (paths[tag]) {
      paths[tag].map((method) => {
        interfaces += this.moduleGenerator.generateMethodTypes(method, schemas, newCtx);
      });
    }

    // {{interface}}
    result = result.replace(
      /{{interface}}/g,
      interfaces,
    );

    // {{imports}}
    const usedTypes = Object.keys(newCtx.usedTypes).filter(type => type !== tag);
    result = result.replace(
      /{{imports}}/g,
      usedTypes.map(type => `import { ${type} } from './${this.getFileName(type)}';`).join('\n'),
    );

    // {{indexImport}}
    result = result.replace(
      /{{indexImport}}/g,
      `import * as Api from './${this.indexFileGenerator.getIndexFileName()}';`,
    );

    return result;
  }
}
