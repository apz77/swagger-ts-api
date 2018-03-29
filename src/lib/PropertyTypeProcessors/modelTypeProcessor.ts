import { TypeProcessor, TypeProcessorContext } from './typePropcessor';
import { BasicType, PropertyType, SwaggerSchemaProperty } from '../types';

export class ModelTypeProcessor implements TypeProcessor {

  consume(swaggerSchemaProperty: SwaggerSchemaProperty,
          typeName: string,
          ctx: TypeProcessorContext): PropertyType | null {

    const metadata = swaggerSchemaProperty['x-metadata'];

    if (typeName !== 'null' && typeName !== 'array') {
      if (metadata && metadata.schema) {
        switch (metadata.schema) {
          case 'Schema': return {
            basicType: BasicType.MODELTYPE,
          };
          case 'SchemaId': return {
            basicType: BasicType.MODELID,
          };
        }
      }
    }

    return null;
  }
}
