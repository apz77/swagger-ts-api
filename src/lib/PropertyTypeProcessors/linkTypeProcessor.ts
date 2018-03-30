import { TypeProcessor, TypeProcessorContext } from './typePropcessor';
import { BasicType, PropertyType, SwaggerSchemaProperty } from '../types';
import { getErrorType } from '../schemaProcessor/schemaProperty';

export class LinkTypeProcessor implements TypeProcessor {

  consume(swaggerSchemaProperty: SwaggerSchemaProperty,
          typeName: string,
          ctx: TypeProcessorContext): PropertyType | null {

    const name = ctx.propertyName;
    const metadata = swaggerSchemaProperty['x-metadata'];

    if (typeName !== 'null' && typeName !== 'array') {
      if (metadata && metadata.schema) {
        switch (metadata.schema) {
          case 'Permit': return {
            basicType: BasicType.PERMIT,
          };
          case 'FolderType': return {
            basicType: BasicType.FOLDERTYPE,
          };
          case 'InvitationStatus': return {
            basicType: BasicType.INVITATIONSTATUS,
          };
          default: return {
            basicType: BasicType.LINK,
            linkTo: metadata.schema,
          };
        }
      } else {
        if (name.length > 2 && name.substr(-2) === 'Id' && name !== 'emailId') {
          ctx.hasErrors = true;
          return getErrorType(
            `x-metadata with schema required for Link type. ${JSON.stringify(swaggerSchemaProperty)}`
          );
        }
      }
    }

    return null;
  }
}
