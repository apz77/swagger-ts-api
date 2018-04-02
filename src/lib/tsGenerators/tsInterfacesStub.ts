export const tabsStub: string = '  ';

export const tsInterfacesHeader =
    '/**\n' +
    ' * Please define the following types in generateTypescriptIntefacesWithMetadata stub1\n' +
    ' * Permit, Hostname, Email, Duration, DateTime, DateOnly, FolderType, InvitationStatus\n' +
    ' */\n' +
    '\n' +
    'const v0: undefined = void 0\n' +
    '\n' +
    'export interface BaseModel {\n' +
    '  modelType: ModelTypes,\n' +
    '  id?: string\n' +
    '}\n';

export const defaultBaseTypesDefinition =
    'export type Hostname = string\n' +
    'export type Email = string\n' +
    'export type DateTime = string\n' +
    'export type DateOnly = string\n' +
    'export type Duration = string\n' +
    '\n' +
    'export enum Permit {\n' +
    '  CREATE = 1,\n' +
    '  READ = 2,\n' +
    '  UPDATE = 4,\n' +
    '  DELETE = 8,\n' +
    '  CRUD = 15\n' +
    '}\n' +
    '\n' +
    'export enum FolderType {\n' +
    '  LOGINS = 1,\n' +
    '  FILES = 2,\n' +
    '}\n' +
    '\n' +
    'export enum InvitationStatus {\n' +
    '  PENDING = 1,\n' +
    '  ACCEPTED = 2,\n' +
    '}\n';

export const defaultInterfaceTemplate =
    'export interface {{name}} extends Api.BaseModel {\n' +
    '{{properties}}\n' +
    '}\n' +
    '\n';

export const defaultMetadataTemplate =
    'export module {{name}}Metadata {\n' +
    '\n' +
    '  const type = \'{{name}}\';\n' +
//    '  const emptyModel: {{name}} = {{{emptyModelFields}}};\n' +
//    '\n' +
//    '  Object.freeze(emptyModel);\n' +
    '\n' +
    '  export module fields {\n' +
    '{{fieldsMetadata}}\n' +
    '  }\n' +
    '}\n';

export const defaultFieldMetadataTemplate =
    'export const {{name}} = {\n' +
    '  name: \'{{name}}\',\n' +
    '  types: {{types}},\n' +
    '  subType: \'{{subType}}\',\n' +
    '  isRequired: {{isRequired}},\n' +
    '  apiField: \'{{apiField}}\',\n' +
    '};';

export const methodStub =
  'export const {{methodName}} = ({{methodParam}}): Promise<{{methodResultType}}> => {\n' +
  '\n' +
  '  const headers = { \'Content-Type\': \'{{contentType}}\' };\n' +
  '{{formPrepare}}\n' +
  '  return fetch(\n' +
  '    {{url}},\n' +
  '    {\n' +
  '      headers,\n' +
  '      body: {{body}},\n' +
  '      method: \'{{httpMethod}}\',\n' +
  '      credentials: \'include\',\n' +
  '    },\n' +
  '  ).then((response) => {\n' +
  '      const contentType = response.headers.has(\'Content-Type\') && response.headers.get(\'Content-Type\'); \n' +
  '      if (contentType && contentType.indexOf(\'application/json\') > -1) {\n' +
  '        return response.json()\n' +
  '      }\n' +
  '      return response.text();\n' +
  '  });\n' +
  '};\n'


export const linkMethodStub =
  'export const {{methodName}} = ({{methodParam}}): string => {\n' +
  '  return API_URL +\n' +
  '    `{{url}}`;\n' +
  '};\n';

export const defaultModuleMethodTemplate =
    '{{method}}' +
    '{{requestInterface}}' +
    '{{formInterface}}' +
    '{{responseInterface}}' +
    '{{requestMetadata}}' +
    '{{formMetadata}}' +
    '{{responseMetadata}}';

export const defaultModuleTemplate =
    'export module {{ModuleName}} {\n' +
    '{{allMethods}}\n' +
    '}\n';

export const defaultFileTemplate =
  'import * as Api from \'./api\';\n' +
  '\n' +
  '{{interface}}' +
  '{{module}}\n'

export const defaultIndexTemplate =
  '/* tslint:disable */\n\n' +
  '/* Please define in ../baseTypes.ts the following types, const, and function: */\n' +
  '/* BaseModel, UUID, Email, Hostname, DateTime, DateOnly, Duration, Permit, API_URL, setParams */\n' +
  'export * from \'../baseTypes\';\n\n' +
  '{{files}}\n' +
  '{{commonTypes}}\n'
