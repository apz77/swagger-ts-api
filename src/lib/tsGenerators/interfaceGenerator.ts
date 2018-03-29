import { AllSchemas, ArrayType, BasicType, LinkType, ObjectProperty, Schema } from '../types';
import { TypeToTsPropertyConverter, TypeToTsPropertyConverterContext } from './typeToTsPropertyConverter';
import { defaultInterfaceTemplate, defaultFieldMetadataTemplate, defaultMetadataTemplate } from './tsInterfacesStub';

export interface InterfaceGeneratorContext {
  hasErrors: boolean;
  tabs: number;
}

export class InterfaceGenerator {

  protected template: string;
  protected metadataFieldTemplate: string;
  protected metadataTemplate: string;

  constructor(template?: string, metadataTemplate?: string, metadataFieldTemplate?: string) {
    this.template = template || defaultInterfaceTemplate;
    this.metadataFieldTemplate = metadataFieldTemplate || defaultFieldMetadataTemplate;
    this.metadataTemplate = metadataTemplate || defaultMetadataTemplate;
  }


  generateModelTypes(allSchemas: AllSchemas): string {
    return `export type ModelTypes = ${Object.keys(allSchemas).map((schemaName) => `\"${schemaName}\"`).join(' | ')}\n`;
  }

  generate(schema: Schema, allSchemas: AllSchemas, ctx: InterfaceGeneratorContext): string {
    const typeToTsPropertyConverter = new TypeToTsPropertyConverter(allSchemas);
    let result = this.template.slice();
    const tabs = ctx.tabs || 0;

    if (tabs) {
      result = result.split('\n').map((item) => '    '.repeat(tabs) + item).join('\n');
    }

        // {{name}}
    result = result.replace(/{{name}}/g, schema.name);

        // {{properties}}
    const { properties } = schema;
    const propertyNames = Object.keys(properties);

    const newCtx = Object.assign({
      schema,
      tabs: tabs + 1,

    },                           ctx);

    const interfaceProperties = propertyNames.map((propertyName) => {
      const property = properties[propertyName];
      const types = property.types.map((type) => typeToTsPropertyConverter.convert(type, newCtx));
      return `${'    '.repeat(tabs + 1)}${getPropertyName(property, newCtx)}${property.isRequired ? '' : '?'}:` +
       `${types.join(' | ')}`;
    },
        );

    result = result.replace(/{{properties}}/g, interfaceProperties.join('\n'));

    ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;

    return result;
  }

  public generateMetadata(schema: Schema, allSchemas: AllSchemas, ctx: InterfaceGeneratorContext): string {
    let result: string = this.metadataTemplate.slice();
    if (ctx.tabs) {
      result = result.split('\n').map((item) => '    '.repeat(ctx.tabs) + item).join('\n');
    }

    const { properties } = schema;
    const propertyNames = Object.keys(properties);

    const newCtx = Object.assign(
      {
        schema,
        tabs: (ctx.tabs || 0) + 1,
      },
      ctx,
    );

    // {{name}}
    result = result.replace(/{{name}}/g, schema.name);

    // {{emptyModelFields}}
    const requiredFields = propertyNames
            .filter((propertyName) => properties[propertyName].isRequired)
            .map((propertyName) => `${getPropertyName(properties[propertyName], newCtx)}: v0`);

    requiredFields.unshift(`modelType: \"${schema.name}\"`);
    result = result.replace(/{{emptyModelFields}}/g, requiredFields.join(','));

    // {{fieldsMetadata}}
    const fieldsMetadata = propertyNames
            .map((propertyName) => {
                const property = properties[propertyName];
                let template = this.metadataFieldTemplate.slice();
                const tabs = newCtx.tabs + 1;
                template = template.split('\n').map((item) => '    '.repeat(tabs + 1) + item).join('\n');

                template = template.replace(/{{name}}/g, getPropertyName(property, newCtx));
                template = template.replace(/{{types}}/g, this.getPropertyMetadataTypes(property));
                template = template.replace(/{{subType}}/g, this.getPropertyMetadataSubType(property));
                template = template.replace(/{{isRequired}}/g, `${property.isRequired}`);
                template = template.replace(/{{apiField}}/g, propertyName);
                return template;
            })
            .join('');

    ctx.hasErrors = ctx.hasErrors || newCtx.hasErrors;

    result = result.replace(/{{fieldsMetadata}}/g, fieldsMetadata);

    return result;
  }

  protected getPropertyMetadataTypes(property: ObjectProperty): string {
    return `[${property.types.map((type) => `\"${type.basicType}\"`).join(', ')}]`;
  }

  protected getPropertyMetadataSubType(property: ObjectProperty): string {
    const linkType = property.types.find((type) => type.basicType === BasicType.LINK) as LinkType;
    if (linkType) {
      return linkType.linkTo;
    }

    const arrayType = property.types.find((type) => type.basicType === BasicType.ARRAY) as ArrayType;
    if (arrayType) {
      if (arrayType.arrayType.basicType === BasicType.LINK) {
        return (arrayType.arrayType as LinkType).linkTo;
      }
      return arrayType.arrayType.basicType;
    }


    return '';
  }
}

export function getPropertyName(property: ObjectProperty, ctx: TypeToTsPropertyConverterContext) {
  if (property.types.find((type) => type.basicType === BasicType.LINK)) {
    if (property.name.substr(-2) === 'Id') {
      return property.name.substr(0, property.name.length - 2);
    }
    console.log(`Property ${ctx.schema.name}.${property.name} is a link, but does not end with Id.`);
  }
  return property.name;
}
