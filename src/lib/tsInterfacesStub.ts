export const tsInterfacesHeader =
    "/**\n" +
    " * Please define the following types in generateTypescriptIntefacesWithMetadata stub1\n" +
    " * Permit, Hostname, Email, DateTime, DateOnly, FolderType, InvitationStatus\n" +
    " */\n" +
    "\n" +
    "const v0: undefined = void 0\n" +
    "\n" +
    "export interface BaseModel {\n" +
    "    type: ModelTypes,\n" +
    "    id: string\n" +
    "}\n"


export const defaultBaseTypesDefinition =
    "export type Hostname = string\n" +
    "export type Email = string\n" +
    "export type DateTime = string\n" +
    "export type DateOnly = string\n" +
    "\n" +
    "export enum Permit {\n" +
    "    CREATE = 1,\n" +
    "    READ = 2,\n" +
    "    UPDATE = 4,\n" +
    "    DELETE = 8,\n" +
    "    CRUD = 15\n" +
    "}\n" +
    "\n" +
    "export enum FolderType {\n" +
    "    LOGINS = 1,\n" +
    "    FILES = 2,\n" +
    "}\n" +
    "\n" +
    "export enum InvitationStatus {\n" +
    "    PENDING = 1,\n" +
    "    ACCEPTED = 2,\n" +
    "}\n"


