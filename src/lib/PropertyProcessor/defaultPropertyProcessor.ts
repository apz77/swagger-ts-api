import { PropertyProcessor, PropertyProcessorContext } from '../schemaProcessor/schemaProperty';
import { ObjectProperty, SwaggerSchemaProperty } from '../types';
import { TypeFactory } from '../PropertyTypeProcessors/typePropcessor';


export class DefaultPropertyProcessor implements PropertyProcessor {

  constructor(protected typeFactory: TypeFactory) {}

  consume(name: string,
          property: SwaggerSchemaProperty,
          isRequired: boolean,
          ctx: PropertyProcessorContext): ObjectProperty | null {

    const propTypes = Array.isArray(property.type) ? property.type : [property.type];
    const factoryContext = Object.assign(
      {
        propertyName: name,
        swaggerSchemaProperty: property,
        typeFactory: this.typeFactory,
      },
      ctx,
    );

    const inPathPart = property.description && property.description.toLocaleLowerCase() === 'taken from path'
      ? { inPath: true } as { inPath: true }
      : {};

    return {
      name,
      isRequired,
      ...inPathPart,
      types: propTypes.map((typeName: string) => this.typeFactory.translateType(property, typeName, factoryContext)),
    };
  }

}
