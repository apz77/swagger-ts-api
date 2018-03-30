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
    [BasicType.JSON]: 'string',
    [BasicType.BLOB]: 'Blob',
  };

  protected basicPrefixedTypesMap: {[key: string]: string} = {
    [BasicType.DATE]: 'DateOnly',
    [BasicType.DATETIME]: 'DateTime',
    [BasicType.HOSTNAME]: 'Hostname',
    [BasicType.DURATION]: 'Duration',
    [BasicType.EMAIL]: 'Email',
    [BasicType.PERMIT]: 'Permit',
    [BasicType.FOLDERTYPE]: 'FolderType',
    [BasicType.INVITATIONSTATUS]: 'InvitationStatus',
    [BasicType.UUID]: 'UUID',
  };


  constructor(protected allSchemas: AllSchemas) {}

  public convert(type: PropertyType, apiPrefix: string, ctx: TypeToTsPropertyConverterContext): any {
    if (this.basicTypesMap[type.basicType]) {
      return this.basicTypesMap[type.basicType];
    }

    if (this.basicPrefixedTypesMap[type.basicType]) {
      return apiPrefix + this.basicPrefixedTypesMap[type.basicType];
    }

    switch (type.basicType) {
      case BasicType.MODELTYPE: return 'ModelTypes';
      case BasicType.MODELID: return 'string';
      case BasicType.ARRAY: return `(${this.convert((type as ArrayType).arrayType, apiPrefix, ctx)})[]`;
      case BasicType.OBJECT: return this.convertObject(type as ObjectType, apiPrefix, ctx);
      case BasicType.ENUM: return (type as EnumType).values.map(val => `'${val}'`).join(' | ');
      case BasicType.LINK: if (this.allSchemas[(type as LinkType).linkTo]) {
        return apiPrefix + (type as LinkType).linkTo;
      }
        ctx.hasErrors = true;
        const error = `${ctx.schema.name} ErrorType(model ${(type as LinkType).linkTo} ` +
          `has not been found in swagger doc)`;
        console.error(error);
        return error;

      case BasicType.ERROR: return `ErrorType(${(type as ErrorType).error})`;
    }
  }

  protected convertObject(type: ObjectType, apiPrefix: string, ctx: TypeToTsPropertyConverterContext) {
    const { properties } = type;
    const tabs = ctx.tabs + 1;
    const nextCtx = {
      ...ctx,
      tabs,
    };

    const objectInterface = Object.keys(properties).map((propertyName: string) => {
        const property = properties[propertyName];
        const types = property.types.map(subType => this.convert(subType, apiPrefix, nextCtx));
        return `${tabsStub.repeat(tabs)}` +
          `${getPropertyName(property, ctx)}${property.isRequired ? '' : '?'}: ${types.join(' | ')};`;
      }).join('\n');

    return `{\n${objectInterface}\n${tabsStub.repeat(ctx.tabs)}}`;
  }
}
