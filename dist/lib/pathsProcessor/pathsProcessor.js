"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathsProcessor = /** @class */ (function () {
    function PathsProcessor(pathProcessor) {
        this.pathProcessor = pathProcessor;
        this.httpMethods = ['get', 'post', 'put', 'delete'];
    }
    PathsProcessor.prototype.translatePaths = function (swaggerPaths, ctx) {
        var result = {};
        for (var pathName in swaggerPaths) {
            var swaggerPath = swaggerPaths[pathName];
            for (var _i = 0, _a = this.httpMethods; _i < _a.length; _i++) {
                var httpMethod = _a[_i];
                var swaggerMethod = swaggerPath[httpMethod];
                if (swaggerMethod) {
                    var method = this.pathProcessor.translatePath(pathName, httpMethod, swaggerMethod, ctx);
                    if (!result[method.tag]) {
                        result[method.tag] = [];
                    }
                    result[method.tag].push(method);
                }
            }
        }
        return result;
    };
    return PathsProcessor;
}());
exports.PathsProcessor = PathsProcessor;
//# sourceMappingURL=pathsProcessor.js.map