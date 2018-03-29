import { BasicType, PropertyType, SwaggerSchemaProperty } from '../types';
import { getErrorType } from '../schemaProcessor/schemaProperty';
import { TypeProcessor, TypeProcessorContext } from './typePropcessor';

export class BasicTypeProcessor implements TypeProcessor {

  protected basicTypeMap: {[key: string]: BasicType} = {
    null: BasicType.NULL,
    string: BasicType.STRING,
    boolean: BasicType.BOOLEAN,
    number: BasicType.NUMBER,
    integer: BasicType.NUMBER,
  };

  protected formatMap: {[key: string]: BasicType} = {
    duration: BasicType.DURATION,
    date: BasicType.DATE,
    'date-time': BasicType.DATETIME,
    hostname: BasicType.HOSTNAME,
    email: BasicType.EMAIL,
    json: BasicType.JSON,
  };

  consume(swaggerSchemaProperty: SwaggerSchemaProperty,
          typeName: string,
          ctx: TypeProcessorContext): PropertyType | null {

    const name = ctx.propertyName;

        // Very basic type
    if (!swaggerSchemaProperty.format || typeName === 'null') {
      if (name.substr(-2) !== 'Id' || typeName === 'null' || name === 'emailId') {
        return {
          basicType: this.basicTypeMap[typeName],
        };
      }
    } else if (this.formatMap[swaggerSchemaProperty.format]) {
            // formatted string
      if (typeName === 'string') {
        return {
          basicType: this.formatMap[swaggerSchemaProperty.format],
        };
      } else if (swaggerSchemaProperty.type === 'null') {
        return {
          basicType: BasicType.NULL,
        };
      } else {
        ctx.hasErrors = true;
        return getErrorType(
                    `Property ${name} has format ${swaggerSchemaProperty.format}, but not string|null type ${typeName}`,
                );
      }
    }

    return null;
  }
}
