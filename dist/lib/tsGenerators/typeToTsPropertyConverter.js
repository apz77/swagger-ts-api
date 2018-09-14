"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var interfaceGenerator_1 = require("./interfaceGenerator");
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var TypeToTsPropertyConverter = /** @class */ (function () {
    function TypeToTsPropertyConverter(allSchemas) {
        this.allSchemas = allSchemas;
    }
    TypeToTsPropertyConverter.prototype.getBasicTypesMap = function (ctx) {
        return ctx.rawTypes
            ? (_a = {},
                _a[types_1.BasicType.NULL] = 'null',
                _a[types_1.BasicType.STRING] = 'string',
                _a[types_1.BasicType.NUMBER] = 'number',
                _a[types_1.BasicType.BOOLEAN] = 'boolean',
                _a[types_1.BasicType.JSON] = 'string',
                _a[types_1.BasicType.BLOB] = 'Blob',
                _a[types_1.BasicType.DATE] = 'string',
                _a[types_1.BasicType.HOSTNAME] = 'string',
                _a[types_1.BasicType.DURATION] = 'string',
                _a[types_1.BasicType.EMAIL] = 'string',
                _a[types_1.BasicType.UUID] = 'string',
                _a[types_1.BasicType.DATETIME] = 'string',
                _a) : (_b = {},
            _b[types_1.BasicType.NULL] = 'null',
            _b[types_1.BasicType.STRING] = 'string',
            _b[types_1.BasicType.NUMBER] = 'number',
            _b[types_1.BasicType.BOOLEAN] = 'boolean',
            _b[types_1.BasicType.JSON] = 'string',
            _b[types_1.BasicType.BLOB] = 'Blob',
            _b);
        var _a, _b;
    };
    TypeToTsPropertyConverter.prototype.getBasicPrefixedTypesMap = function (ctx) {
        return ctx.rawTypes
            ? (_a = {},
                _a[types_1.BasicType.PERMIT] = 'Permit',
                _a[types_1.BasicType.FOLDERTYPE] = 'FolderType',
                _a[types_1.BasicType.INVITATIONSTATUS] = 'InvitationStatus',
                _a) : (_b = {},
            _b[types_1.BasicType.DATE] = 'DateOnly',
            _b[types_1.BasicType.DATETIME] = 'DateTime',
            _b[types_1.BasicType.HOSTNAME] = 'Hostname',
            _b[types_1.BasicType.DURATION] = 'Duration',
            _b[types_1.BasicType.EMAIL] = 'Email',
            _b[types_1.BasicType.PERMIT] = 'Permit',
            _b[types_1.BasicType.FOLDERTYPE] = 'FolderType',
            _b[types_1.BasicType.INVITATIONSTATUS] = 'InvitationStatus',
            _b[types_1.BasicType.UUID] = 'UUID',
            _b);
        var _a, _b;
    };
    TypeToTsPropertyConverter.prototype.convert = function (type, apiPrefix, ctx) {
        if (this.getBasicTypesMap(ctx)[type.basicType]) {
            return this.getBasicTypesMap(ctx)[type.basicType];
        }
        if (this.getBasicPrefixedTypesMap(ctx)[type.basicType]) {
            return apiPrefix + this.getBasicPrefixedTypesMap(ctx)[type.basicType];
        }
        switch (type.basicType) {
            case types_1.BasicType.MODELTYPE: return apiPrefix + 'ModelTypes';
            case types_1.BasicType.MODELID: return 'string';
            case types_1.BasicType.ARRAY: return "(" + this.convert(type.arrayType, apiPrefix, ctx) + ")[]";
            case types_1.BasicType.OBJECT: return this.convertObject(type, apiPrefix, ctx);
            case types_1.BasicType.ENUM: return type.values.map(function (val) { return "'" + val + "'"; }).join(' | ');
            case types_1.BasicType.LINK:
                if (this.allSchemas[type.linkTo]) {
                    ctx.usedTypes[type.linkTo] = type.linkTo;
                    return type.linkTo;
                }
                ctx.hasErrors = true;
                var error = ctx.schema.name + " ErrorType(model " + type.linkTo + " " +
                    "has not been found in swagger doc)";
                console.error(error);
                return error;
            case types_1.BasicType.ERROR: return "ErrorType(" + type.error + ")";
        }
    };
    TypeToTsPropertyConverter.prototype.convertObject = function (type, apiPrefix, ctx) {
        var _this = this;
        var properties = type.properties;
        var tabs = ctx.tabs + 1;
        var nextCtx = __assign({}, ctx, { tabs: tabs });
        var objectInterface = Object.keys(properties).map(function (propertyName) {
            var property = properties[propertyName];
            var types = property.types.map(function (subType) { return _this.convert(subType, apiPrefix, nextCtx); });
            return "" + tsInterfacesStub_1.tabsStub.repeat(tabs) +
                ("" + interfaceGenerator_1.getPropertyName(property, ctx) + (property.isRequired ? '' : '?') + ": " + types.join(' | ') + ";");
        }).join('\n');
        return "{\n" + objectInterface + "\n" + tsInterfacesStub_1.tabsStub.repeat(ctx.tabs) + "}";
    };
    return TypeToTsPropertyConverter;
}());
exports.TypeToTsPropertyConverter = TypeToTsPropertyConverter;
//# sourceMappingURL=typeToTsPropertyConverter.js.map