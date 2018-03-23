
export interface {{name}} extends BaseModel {
    {{properties}}
}

export module {{name}}Metadata {

    const type = "{{name}}"
    const emptyModel = {
        {{requiredFields}}
    }

    export module fields {
        {{fieldsMetadata}}
    }
}
