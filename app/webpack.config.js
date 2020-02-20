const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

module.exports = function (env) {
  const lambdaFunctionDir = path.join(__dirname);
  const file = fs.readFileSync('./template.yaml', 'utf8');
  const template = YAML.parse(file);
  let lambdas = Object.keys(template.Resources).filter(name => template.Resources[name].Type === 'AWS::Serverless::Function');
  lambdas = lambdas.map(name => console.log(template.Resources[name].Properties.Handler) || [template.Resources[name].Properties.Handler.replace('.lambdaHandler', '.js'), name]);
  return lambdas
    .map(([fxn, dir]) => ({
      mode: 'production',
      context: path.resolve(__dirname),
      entry: path.join(lambdaFunctionDir, fxn),
      output: {
        path: path.join(__dirname, '.aws-sam', dir, 'src'),
        filename: fxn,
        libraryTarget: 'commonjs2'
      },
      optimization: {
        minimize: true,
        namedModules: true
      },
      target: 'node',
      externals: {
        // These modules are already installed on the Lambda instance.
        'aws-sdk': 'aws-sdk',
        'moment': 'moment',
        'axios': 'axios',
      },
      node: {
        // Allow these globals.
        __filename: false,
        __dirname: false
      },
      stats: 'errors-only',
      bail: true
    }));
};
