var DtsBundlerPlugin = require('dtsbundler-webpack-plugin');
var dtsGenerator = require('dts-generator').default;

function DtsGeneratorPlugin(options) {
  // Configure your plugin with options...
}

DtsGeneratorPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compile", function(params) {
    console.log("The compiler is starting to compile...");
  });

  compiler.plugin("compilation", function(compilation) {
    console.log("The compiler is starting a new compilation...");

    compilation.plugin("optimize", function() {
      dtsGenerator({
          name: 'listlab-api',
          project: './',
          main: 'listlab-api/index',
          excludes: ['./typings/**/*.d.ts'],
          out: 'dist/listlab-api.d.ts'
      })
    });
  });

  compiler.plugin("emit", function(compilation, callback) {
    console.log("The compilation is going to emit files...");
    callback();
  });
};

module.exports = {
    entry: "./src/index.ts",

    output: {
        filename: "listlab-api.js",
        path: __dirname + "/dist",
        libraryTarget: "amd"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        loaders: [{
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          exclude: /node_modules/
        }]
    },

    plugins: [
        new DtsGeneratorPlugin()
    ],

    externals: {
        "q": "q",
        "axios": "axios",
        "qs": "qs",
        "immutable": "immutable",
    },
};
