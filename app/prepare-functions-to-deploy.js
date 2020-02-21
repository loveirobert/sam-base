const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

(() => {
  const dirName = __dirname; // eslint-disable-line
  const lambdaFunctionDir = path.join(dirName);
  const file = fs.readFileSync('./template.yaml', 'utf8');
  const template = YAML.parse(file);
  let lambdas = Object.keys(template.Resources).filter(name => template.Resources[name].Type === 'AWS::Serverless::Function');
  lambdas = lambdas.map(name => [template.Resources[name].Properties.Handler.replace('.lambdaHandler', '.js'), name]);
  return lambdas
    .map(([fxn, dir]) => {
      const fileName = fxn.split('/').pop();
      fs.mkdirSync(path.join(dirName, '.aws-sam', dir, 'src'), { recursive: true });
      fs.copyFileSync(path.join(lambdaFunctionDir, 'src', fxn), path.join(dirName, '.aws-sam', dir, 'src', fileName));
    });
})();
