import { tabsStub, typeCheckTemplate } from './tsInterfacesStub';
import { ObjectProperty, ObjectType, Schema } from '../types';

export interface TypeCheckGeneratorContext {
  hasErrors: boolean;
  tabs: number;
}

export class TypeCheckGenerator {
  protected apiPrefix = 'Api.';
  protected template = typeCheckTemplate;


  generate(schema: Schema, ctx: TypeCheckGeneratorContext) {
    let result = this.template.slice();
    const { properties } = schema;

    result = result.replace(/{{name}}/g, schema.name);

    // {{requiredProps}}
    let props = Object.keys(properties)
      .filter(key => properties[key].isRequired && !properties[key].types.find(type => (type as any).properties))
      .map(key => `arg.${properties[key].name} !== ${this.apiPrefix}v0`);

    const objectProps = Object.keys(properties)
      .filter(key => properties[key].isRequired && properties[key].types.find(type => (type as any).properties))

    props = props.concat(objectProps.map(key => `Object(arg.${properties[key].name}) === arg.${properties[key].name}`))


    for (const subObject of objectProps) {
      const subProp = properties[subObject];
      const subProps = (subProp as ObjectProperty).types.find(type => (type as any).properties);
      if (subProps) {
        const subPropProps = (subProps as ObjectType).properties;
        props = props.concat(
          Object.keys(subPropProps).map(key => `arg.${subProp.name}.${subPropProps[key].name} !== ${this.apiPrefix}v0`),
        );
      }
    }

    result = result.replace(
      /{{requiredProps}}/g,
      props.length
        ? (' && ' + props.join(' && '))
        : '',
    );

    if (ctx.tabs > 0) {
      result = result.split('\n').map(item => tabsStub.repeat(ctx.tabs) + item).join('\n');
    }

    return result;
  }

}
