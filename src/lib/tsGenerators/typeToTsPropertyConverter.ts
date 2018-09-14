import {
    AllSchemas, ArrayType, BasicType, EnumType, ErrorType, LinkType, ObjectType,
    PropertyType, Schema,
} from '../types';
import { getPropertyName, InterfaceGeneratorContext } from './interfaceGenerator';
import { tabsStub } from './tsInterfacesStub';

export interface TypeToTsPropertyConverterContext extends InterfaceGeneratorContext {
  // Use raw types, e.g. "email: string" instead of "email: Api.Email", "accountId: string" instead of "account: Api.Account"
  rawTypes: boolean;
  schema: Schema;
  tabs: number;
}

export class TypeToTsPropertyConverter {

  protected getBasicTypesMap(ctx: TypeToTsPropertyConverterContext): {[key: string]: string} {
    return ctx.rawTypes
      ? {
        [BasicType.NULL]: 'null',
        [BasicType.STRING]: 'string',
        [BasicType.NUMBER]: 'number',
        [BasicType.BOOLEAN]: 'boolean',
        [BasicType.JSON]: 'string',
        [BasicType.BLOB]: 'Blob',
        [BasicType.DATE]: 'string',
        [BasicType.HOSTNAME]: 'string',
        [BasicType.DURATION]: 'string',
        [BasicType.EMAIL]: 'string',
        [BasicType.UUID]: 'string',
        [BasicType.DATETIME]: 'string',
      }
      : {
        [BasicType.NULL]: 'null',
        [BasicType.STRING]: 'string',
        [BasicType.NUMBER]: 'number',
        [BasicType.BOOLEAN]: 'boolean',
        [BasicType.JSON]: 'string',
        [BasicType.BLOB]: 'Blob',
      };
  }

  protected getBasicPrefixedTypesMap(ctx: TypeToTsPropertyConverterContext): {[key: string]: string} {
    return ctx.rawTypes
      ? {
        [BasicType.PERMIT]: 'Permit',
        [BasicType.FOLDERTYPE]: 'FolderType',
        [BasicType.INVITATIONSTATUS]: 'InvitationStatus',
      }
      : {
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
  }

  constructor(protected allSchemas: AllSchemas) {}

  public convert(type: PropertyType, apiPrefix: string, ctx: TypeToTsPropertyConverterContext): any {
    if (this.getBasicTypesMap(ctx)[type.basicType]) {
      return this.getBasicTypesMap(ctx)[type.basicType];
    }

    if (this.getBasicPrefixedTypesMap(ctx)[type.basicType]) {
      return apiPrefix + this.getBasicPrefixedTypesMap(ctx)[type.basicType];
    }

    switch (type.basicType) {
      case BasicType.MODELTYPE: return apiPrefix + 'ModelTypes';
      case BasicType.MODELID: return 'string';
      case BasicType.ARRAY: return `(${this.convert((type as ArrayType).arrayType, apiPrefix, ctx)})[]`;
      case BasicType.OBJECT: return this.convertObject(type as ObjectType, apiPrefix, ctx);
      case BasicType.ENUM: return (type as EnumType).values.map(val => `'${val}'`).join(' | ');
      case BasicType.LINK:
        if (ctx.rawTypes) {
          return 'string';
        }

        if (this.allSchemas[(type as LinkType).linkTo]) {
          ctx.usedTypes[(type as LinkType).linkTo] = (type as LinkType).linkTo;
          return (type as LinkType).linkTo;
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
