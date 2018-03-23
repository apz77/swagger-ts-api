// Interfaces that come from swagger
export interface SwaggerSchemaProperty {
    type: string | string[]
    format?: string
    enum?: string
    items?: SwaggerSchemaProperty
    properties?: {[key: string]: SwaggerSchemaProperty}
    required?: string[]
    "x-metadata"?: {
        schema?: string
    }
}

export interface SwaggerSchema {
    additionalProperties: boolean
    properties: {[key: string]: SwaggerSchemaProperty}
    required?: string[]
    type: string
}

// Inner properties
export enum BasicType {

    // SimpleTypes
    NULL = 0,
    STRING,
    NUMBER,
    BOOLEAN,
    DATE,
    DATETIME,
    DURATION,
    HOSTNAME,
    EMAIL,
    PERMIT,
    FOLDERTYPE,
    JSON,

    // Specific types
    ARRAY,
    OBJECT,
    ENUM,
    LINK,
    ERROR,
}

export interface PropertyBasicType {
    basicType: BasicType
}

export interface ArrayType extends PropertyBasicType {
    arrayType: PropertyBasicType
}

export interface EnumType extends PropertyBasicType {
    values: string[]
}

export interface ObjectType extends PropertyBasicType {
    properties: {[key: string]: ObjectProperty}
}

export interface LinkType extends PropertyBasicType {
    linkTo: string
}

export interface ErrorType extends PropertyBasicType {
    error: string
}

export type PropertyType = PropertyBasicType | ArrayType | EnumType | ObjectType | LinkType | ErrorType


export interface ObjectProperty {
    name: string
    isRequired: boolean
    types: PropertyType[]
}

export interface Schema {
    name: string
    properties: {[key: string]: ObjectProperty}
}

export interface AllSchemas {
    [key: string]: Schema
}
