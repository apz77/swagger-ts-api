"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var index_1 = require("./index");
var fs = require("fs");
var rimraf = require("rimraf");
var schemaOutFile = 'schema.json';
if (fs.existsSync(schemaOutFile)) {
    fs.unlinkSync(schemaOutFile);
}
request('https://api.bpdevs.com/docs/swagger.json', function (error, response, body) {
    var responseJson = JSON.parse(body);
    var ctx = {
        rawTypes: true,
        hasErrors: false,
        tabs: 0,
    };
    var schemasAndPaths = index_1.parseSwagger(responseJson, ctx);
    var outDir = './out';
    rimraf(outDir, function () {
        fs.mkdirSync(outDir);
        if (schemasAndPaths) {
            index_1.generateTypeScriptFiles(outDir + '/', schemasAndPaths.paths, schemasAndPaths.schemas, ctx);
        }
        fs.appendFileSync(outDir + '/' + schemaOutFile, JSON.stringify(schemasAndPaths, null, 2));
        console.log(ctx.hasErrors ? 'Some errors occured during swagger translation' : 'All is good');
        console.log("Swagger parsing result in " + schemaOutFile);
    });
});
//# sourceMappingURL=test.js.map