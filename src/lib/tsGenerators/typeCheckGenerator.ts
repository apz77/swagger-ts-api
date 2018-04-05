import { tabsStub, typeCheckTemplate } from './tsInterfacesStub';
import { Schema } from '../types';

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
    const props = Object.keys(properties)
      .filter(key => properties[key].isRequired)
      .map(key => `arg.${properties[key].name} !== ${this.apiPrefix}v0`);

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
