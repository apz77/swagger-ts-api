import {
    AllSchemas, ArrayType, BasicType, EnumType, ErrorType, LinkType, ObjectType,
    PropertyType, Schema,
} from '../types';
import { getPropertyName, InterfaceGeneratorContext } from './interfaceGenerator';
import { tabsStub } from './tsInterfacesStub';

export interface TypeToTsPropertyConverterContext extends InterfaceGeneratorContext {
  schema: Schema;
  tabs: number;
}

export class TypeToTsPropertyConverter {

  protected basicTypesMap: {[key: string]: string} = {
    [BasicType.NULL]: 'null',
    [BasicType.STRING]: 'string',
    [BasicType.NUMBER]: 'number',
    [BasicType.BOOLEAN]: 'boolean',
    [BasicType.DATE]: 'DateOnly',
    [BasicType.DATETIME]: 'DateTime',
    [BasicType.HOSTNAME]: 'Hostname',
    [BasicType.DURATION]: 'Duration',
    [BasicType.EMAIL]: 'Email',
    [BasicType.PERMIT]: 'Permit',
    [BasicType.FOLDERTYPE]: 'FolderType',
    [BasicType.INVITATIONSTATUS]: 'InvitationStatus',
    [BasicType.JSON]: 'string',
    [BasicType.BLOB]: 'Blob',
  };

  constructor(protected allSchemas: AllSchemas) {}

  public convert(type: PropertyType, ctx: TypeToTsPropertyConverterContext): any {
    if (this.basicTypesMap[type.basicType]) {
      return this.basicTypesMap[type.basicType];
    }

    switch (type.basicType) {
      case BasicType.MODELTYPE: return 'ModelTypes';
      case BasicType.MODELID: return 'string';
      case BasicType.ARRAY: return `(${this.convert((type as ArrayType).arrayType, ctx)})[]`;
      case BasicType.OBJECT: return this.convertObject(type as ObjectType, ctx);
      case BasicType.ENUM: return (type as EnumType).values.map(val => `'${val}'`).join(' | ');
      case BasicType.LINK: if (this.allSchemas[(type as LinkType).linkTo]) {
        return (type as LinkType).linkTo;
      }
        ctx.hasErrors = true;
        const error = `${ctx.schema.name} ErrorType(model ${(type as LinkType).linkTo}` +
          `has not been found in swagger doc)`;
        console.error(error);
        return error;

      case BasicType.ERROR: return `ErrorType(${(type as ErrorType).error})`;
    }
  }

  protected convertObject(type: ObjectType, ctx: TypeToTsPropertyConverterContext) {
    const { properties } = type;
    const tabs = ctx.tabs + 1;
    const nextCtx = {
      ...ctx,
      tabs,
    };

    const objectInterface = Object.keys(properties).map((propertyName: string) => {
        const property = properties[propertyName];
        const types = property.types.map(subType => this.convert(subType, nextCtx));
        return `${tabsStub.repeat(tabs + 1)}` +
          `${getPropertyName(property, ctx)}${property.isRequired ? '' : '?'}: ${types.join(' | ')};`;
      }).join('\n');

    return `{\n${objectInterface}\n${tabsStub.repeat(tabs)}}`;
  }
}
