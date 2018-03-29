import { SwaggerSchemaProperty, ObjectProperty, BasicType, ErrorType, SwaggerSchema } from '../types';
import { SchemaFactoryContext } from './schema';

export interface PropertyProcessorContext extends SchemaFactoryContext{
  schemaPropertyFactory: SchemaPropertyFactory;
  swaggerSchema: SwaggerSchema;
  schemaName: string;
}

export interface PropertyProcessor {
  consume: (name: string,
            property: SwaggerSchemaProperty,
            isRequired: boolean,
            ctx: PropertyProcessorContext) => ObjectProperty | null;
}

export class SchemaPropertyFactory {
  constructor(protected propertyProcessors: PropertyProcessor[]) {
  }

  translateProperty(schemaName: string,
                    swaggerProperty: SwaggerSchemaProperty,
                    isRequired: boolean,
                    ctx: PropertyProcessorContext) {
    for (const processor of this.propertyProcessors) {
      const result = processor.consume(schemaName, swaggerProperty, isRequired, ctx);
      if (result) {
        return result;
      }
    }
    return null;
  }
}

export function getErrorType(error: string): ErrorType {
  console.error(error);
  return {
    error,
    basicType: BasicType.ERROR,
  };
}
