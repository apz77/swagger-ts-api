"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsInterfacesStub_1 = require("./tsInterfacesStub");
var IndexFileGenerator = /** @class */ (function () {
    function IndexFileGenerator(interfaceGenerator) {
        this.interfaceGenerator = interfaceGenerator;
        this.indexTemplate = tsInterfacesStub_1.defaultIndexTemplate;
    }
    IndexFileGenerator.prototype.getIndexFileName = function () {
        return 'api';
    };
    IndexFileGenerator.prototype.generateIndex = function (schemas, tags) {
        var result = this.indexTemplate.slice();
        result = result.replace(/{{commonTypes}}/g, "\n" + this.interfaceGenerator.generateModelTypes(schemas) + "\n export const v0 = void 0;\n");
        return result;
    };
    return IndexFileGenerator;
}());
exports.IndexFileGenerator = IndexFileGenerator;
//# sourceMappingURL=indexFileGenerator.js.map