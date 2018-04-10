import { TypeProcessor, TypeProcessorContext } from './typePropcessor';
import { BasicType, PropertyType, SwaggerSchemaProperty } from '../types';

export class LinkTypeProcessor implements TypeProcessor {

  consume(swaggerSchemaProperty: SwaggerSchemaProperty,
          typeName: string,
          ctx: TypeProcessorContext): PropertyType | null {

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
      }
    }

    return null;
  }
}
