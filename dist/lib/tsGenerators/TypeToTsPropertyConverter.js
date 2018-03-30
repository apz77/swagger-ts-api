"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var interfaceGenerator_1 = require("./interfaceGenerator");
var TypeToTsPropertyConverter = /** @class */ (function () {
    function TypeToTsPropertyConverter(allSchemas) {
        this.allSchemas = allSchemas;
        this.basicTypesMap = (_a = {},
            _a[types_1.BasicType.NULL] = "null",
            _a[types_1.BasicType.STRING] = "string",
            _a[types_1.BasicType.NUMBER] = "number",
            _a[types_1.BasicType.BOOLEAN] = "boolean",
            _a[types_1.BasicType.DATE] = "DateOnly",
            _a[types_1.BasicType.DATETIME] = "DateTime",
            _a[types_1.BasicType.HOSTNAME] = "Hostname",
            _a[types_1.BasicType.DURATION] = "Duration",
            _a[types_1.BasicType.EMAIL] = "Email",
            _a[types_1.BasicType.PERMIT] = "Permit",
            _a[types_1.BasicType.FOLDERTYPE] = "FolderType",
            _a[types_1.BasicType.INVITATIONSTATUS] = "InvitationStatus",
            _a[types_1.BasicType.JSON] = "string",
            _a);
        var _a;
    }
    TypeToTsPropertyConverter.prototype.convert = function (type, ctx) {
        if (this.basicTypesMap[type.basicType]) {
            return this.basicTypesMap[type.basicType];
        }
        var nextCtx = Object.assign({}, ctx);
        nextCtx.howDeepIsYourLove = nextCtx.howDeepIsYourLove ? 1 : nextCtx.howDeepIsYourLove + 1;
        switch (type.basicType) {
            case types_1.BasicType.MODELTYPE: return "ModelTypes";
            case types_1.BasicType.MODELID: return "string";
            case types_1.BasicType.ARRAY: return "Array<" + this.convert(type.arrayType, ctx) + ">";
            case types_1.BasicType.OBJECT: return this.convertObject(type, ctx);
            case types_1.BasicType.ENUM: return type.values.map(function (val) { return "\"" + val + "\""; }).join(" | ");
            case types_1.BasicType.LINK: if (this.allSchemas[type.linkTo]) {
                return type.linkTo;
            }
            else {
                ctx.hasErrors = true;
                var error = ctx.schema.name + " ErrorType(model " + type.linkTo + " has not been found in swagger doc)";
                console.error(error);
                return error;
            }
            case types_1.BasicType.ERROR: return "ErrorType(" + type.error + ")";
        }
    };
    TypeToTsPropertyConverter.prototype.convertObject = function (type, ctx) {
        var _this = this;
        var properties = type.properties;
        var objectInterface = Object.keys(properties).map(function (propertyName) {
            var property = properties[propertyName];
            var types = property.types.map(function (subType) { return _this.convert(subType, ctx); });
            return "" + "    ".repeat(ctx.tabs + 1) + interfaceGenerator_1.getPropertyName(property, ctx) + (property.isRequired ? "" : "?") + ": " + types.join(" | ");
        }).join("\n");
        return "{\n" + objectInterface + "\n" + "    ".repeat(ctx.tabs) + "}\n";
    };
    return TypeToTsPropertyConverter;
}());
exports.TypeToTsPropertyConverter = TypeToTsPropertyConverter;
//# sourceMappingURL=TypeToTsPropertyConverter.js.map
