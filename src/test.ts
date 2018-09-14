import * as request from 'request';
import {
  generateTypeScriptFiles,
  parseSwagger,
} from './index';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

const schemaOutFile = 'schema.json';

if (fs.existsSync(schemaOutFile)) {
  fs.unlinkSync(schemaOutFile);
}

request('https://api.bpdevs.com/docs/swagger.json', (error: any, response: any, body: string) => {
  const responseJson = JSON.parse(body);


  const ctx = {
    rawTypes: true,
    hasErrors: false,
    tabs: 0,
  };

  const schemasAndPaths = parseSwagger(responseJson, ctx);
  const outDir = '../out';

  rimraf(outDir, () => {

    fs.mkdirSync(outDir);

    if (schemasAndPaths) {
      generateTypeScriptFiles(outDir + '/' ,schemasAndPaths.paths, schemasAndPaths.schemas, ctx);
    }

    fs.appendFileSync(outDir + '/' + schemaOutFile, JSON.stringify(schemasAndPaths, null, 2));

    console.log(ctx.hasErrors ? 'Some errors occured during swagger translation' : 'All is good');
    console.log(`Swagger parsing result in ${schemaOutFile}`);
  });

});


