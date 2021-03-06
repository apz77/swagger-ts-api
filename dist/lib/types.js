"use strict";
// Interfaces that come from swagger
Object.defineProperty(exports, "__esModule", { value: true });
// Inner properties
var BasicType;
(function (BasicType) {
    // SimpleTypes
    BasicType["NULL"] = "null";
    BasicType["STRING"] = "string";
    BasicType["NUMBER"] = "number";
    BasicType["BOOLEAN"] = "boolean";
    BasicType["DATE"] = "DateOnly";
    BasicType["DATETIME"] = "DateTime";
    BasicType["DURATION"] = "Duration";
    BasicType["HOSTNAME"] = "Hostname";
    BasicType["EMAIL"] = "Email";
    BasicType["PERMIT"] = "Permit";
    BasicType["FOLDERTYPE"] = "FolderType";
    BasicType["INVITATIONSTATUS"] = "InvitationStatus";
    BasicType["JSON"] = "JSON";
    BasicType["MODELTYPE"] = "ModelType";
    BasicType["MODELID"] = "ModelId";
    BasicType["BLOB"] = "Blob";
    BasicType["UUID"] = "UUID";
    // Specific types
    BasicType["ARRAY"] = "array";
    BasicType["OBJECT"] = "object";
    BasicType["ENUM"] = "enum";
    BasicType["LINK"] = "link";
    BasicType["ERROR"] = "error";
})(BasicType = exports.BasicType || (exports.BasicType = {}));
function isEmptyModel(schema) {
    return !schema || (Object(schema) === schema && Object.keys(schema.properties).length === 0);
}
exports.isEmptyModel = isEmptyModel;
//# sourceMappingURL=types.js.map