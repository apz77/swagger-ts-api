/* tslint:disable:max-line-length */

export const tabsStub: string = '  ';

export const tsInterfacesHeader =
    '/**\n' +
    ' * Please define the following types in generateTypescriptIntefacesWithMetadata stub\n' +
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
    '  export const modelType = \'{{name}}\';\n' +
    '  export const emptyModel = { {{emptyModelFields}} };\n' +
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
    '{{comment}}' +
    'export const {{methodName}} = ({{methodParam}}): Promise<{{methodResultType}}> => {\n' +
    '{{formPrepare}}\n' +
    '  return {{apiPrefix}}fetchApi<{{methodResultType}}>(\n' +
    '    {{url}},\n' +
    '    \'{{httpMethod}}\',\n' +
    '    {{body}},\n' +
    '    {{formData}},\n' +
    '    {{responseTypeCheckFunction}},\n' +
    '  );\n' +
    '};\n';

export const methodStubOld =
  '{{comment}}' +
  'export const {{methodName}} = ({{methodParam}}): Promise<{{methodResultType}}> => {\n' +
  '\n' +
  '  const headers = Api.getHeaders({{headersParams}});\n' +
  '{{formPrepare}}\n' +
  '  return fetch(\n' +
  '    {{url}},\n' +
  '    {\n' +
  '      headers,\n' +
  '      body: {{body}},\n' +
  '      method: \'{{httpMethod}}\',\n' +
  '      credentials: \'include\',\n' +
  '    },\n' +
  '  ).then((response: Response) => {\n' +
  '    if (!response.ok) {\n' +
  '      return Api.processError(response);\n' +
  '    }\n' +
  '    const contentType = response.headers.has(\'Content-Type\') && response.headers.get(\'Content-Type\'); \n' +
  '    if (contentType && contentType.indexOf(\'application/json\') > -1) {\n' +
  '      return response.json(){{typeCheckCode}}\n' +
  '    }\n' +
  '    return response.text();\n' +
  '  });\n' +
  '};\n'


export const typeCheckCode = '\n' +
  '        .then((decodedResponse: any) => {\n' +
  '          if ({{responseTypeCheckFunction}}) {\n' +
  '            return decodedResponse;\n' +
  '          }\n' +
  '          throw (`Response is not {{responseTypeCheckFunction}}: ${JSON.stringify(decodedResponse)}`);\n' +
  '        });\n';

export const linkMethodStub =
  '{{comment}}' +
  'export const {{methodName}} = ({{methodParam}}): string => {\n' +
  '  return {{url}};\n' +
  '};\n';

export const defaultModuleMethodTemplate =
    '{{method}}' +
    '{{requestMetadata}}' +
    '{{formMetadata}}' +
    '{{responseMetadata}}';

export const defaultModuleTemplate =
    '{{indexImport}}\n' +
    '{{imports}}\n\n' +
    'export module {{ModuleName}} {\n' +
    '{{allMethods}}\n' +
    '}\n';


export const defaultTypeFileTemplate =
  '/* tslint:disable:max-line-length */\n\n' +
  '{{indexImport}}\n' +
  '{{imports}}' +
  '\n\n' +
  '{{interface}}' +
  '\n'


export const defaultIndexTemplate =
  '/* tslint:disable */\n\n' +
  '/* Please define in ../baseTypes.ts the following types, const, and function: processError */\n' +
  '/* BaseModel, UUID, Email, Hostname, DateTime, DateOnly, Duration, Permit, API_URL, setParams, getHeaders, serialize */\n' +
  'export {\n' +
  '  BaseModel,\n' +
  '  UUID,\n' +
  '  Email,\n' +
  '  Hostname,\n' +
  '  DateTime,\n' +
  '  DateOnly,\n' +
  '  Duration,\n' +
  '  Permit,\n' +
  '  API_URL,\n' +
  '  setParams,\n' +
  '  getHeaders,\n' +
  '  serialize,\n' +
  '  processError,\n' +
  '  FolderType,\n' +
  '  InvitationStatus,\n' +
  '  fetchApi,\n' +
  '} from \'../baseTypes\';\n' +
  '\n' +
  '{{commonTypes}}\n'


export const typeCheckTemplate = 'export function is{{name}}(arg: any): arg is {{name}} {\n' +
  '  return arg && (typeof arg === \'object\') {{requiredProps}};\n' +
  '}\n';


