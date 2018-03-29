import { HttpMethods, Paths, SwaggerPaths } from '../types';
import { PathProcessor } from './pathProcessor';

export interface PathsProcessorContext {
  hasErrors: boolean;
}

export class PathsProcessor {
  protected httpMethods: HttpMethods[] = ['get', 'post', 'put', 'delete'];

  constructor(protected pathProcessor: PathProcessor) {}

  public translatePaths(swaggerPaths: SwaggerPaths, ctx: PathsProcessorContext): Paths {
    const result: Paths = {};


    for (const pathName in swaggerPaths) {
      const swaggerPath = swaggerPaths[pathName];

      for (const httpMethod of this.httpMethods) {
        const swaggerMethod = swaggerPath[httpMethod];
        if (swaggerMethod) {
          const method = this.pathProcessor.translatePath(pathName, httpMethod, swaggerMethod, ctx);
          if (!result[method.tag]) {
            result[method.tag] = [];
          }

          result[method.tag].push(method);
        }
      }
    }

    return result;
  }
}
