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

    const schemaName = Object.keys(schemas).find(schema => schema.toLowerCase() === tag.toLowerCase())

    if (schemaName && schemas[schemaName]) {
      interfaces +=
        this.interfaceGenerator.generate(schemas[schemaName], schemas, newCtx) + '\n\n' +
        this.typeCheckGenerator.generate(schemas[schemaName], newCtx) + '\n\n';
    }

    const pathName = Object.keys(paths).find(paths => paths.toLowerCase() === tag.toLowerCase());

    if (pathName && paths[pathName]) {
      paths[pathName].map((method) => {
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
