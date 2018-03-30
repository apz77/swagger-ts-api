"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var schemaProperty_1 = require("../schemaProperty");
var LinkTypeProcessor = /** @class */ (function () {
    function LinkTypeProcessor() {
    }
    LinkTypeProcessor.prototype.consume = function (swaggerSchemaProperty, typeName, ctx) {
        var name = ctx.propertyName;
        var metadata = swaggerSchemaProperty["x-metadata"];
        if (typeName !== "null" && typeName !== "array") {
            if (metadata && metadata.schema) {
                switch (metadata.schema) {
                    case "Permit": return {
                        basicType: types_1.BasicType.PERMIT
                    };
                    case "FolderType": return {
                        basicType: types_1.BasicType.FOLDERTYPE
                    };
                    case "InvitationStatus": return {
                        basicType: types_1.BasicType.INVITATIONSTATUS
                    };
                    default: return {
                        basicType: types_1.BasicType.LINK,
                        linkTo: metadata.schema
                    };
                }
            }
            else {
                if (name.length > 2 && name.substr(-2) === "Id" && name !== "emailId") {
                    ctx.hasErrors = true;
                    return schemaProperty_1.getErrorType("x-metadata with schema required for Link type.");
                }
            }
        }
        return null;
    };
    return LinkTypeProcessor;
}());
exports.LinkTypeProcessor = LinkTypeProcessor;
//# sourceMappingURL=linkTypeProcessor.js.map