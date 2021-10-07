const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpackDevClientEntry = require.resolve(
    'react-dev-utils/webpackHotDevClient'
);
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];
// ResolveApp
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
        );
        
        if (extension) {
            return resolveFn(`${filePath}.${extension}`);
        }
        
        return resolveFn(`${filePath}.js`);
};

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

const paths = {
    appSrc: resolveApp('src'),
    appHtml: resolveApp('public/index.html'),
    appIndexTsx: resolveModule(resolveApp, 'src/index'),
    // admin page
    appAdminHtml: resolveApp('public/admin.html'),
    appAdminIndexTsx: resolveModule(resolveApp, 'src/admin/index'),
    publicUrlOrPath
    
};
    
module.exports = {
        // WEBPACK CONFIGURATION OVERRIDES
    webpack: function(config, env) {
        const isEnvDevelopment = env === "development";
        const isEnvProduction = env === "production";
        
        // webpack multi entry points
        config.entry = {
            index: [
              isEnvDevelopment && webpackDevClientEntry,
              paths.appSrc + '/index.tsx',
    
            ].filter(Boolean),
    
            admin: [
              isEnvDevelopment && webpackDevClientEntry,
              paths.appSrc + '/admin/index.tsx',
            ].filter(Boolean),
        }
        // // chunkFileName
        // // config.output.chunkFilename = isEnvProduction
        // //     ? 'static/js/[name].[contenthash:8].chunk.js'
        // //     : isEnvDevelopment && 'static/js/[name].chunk.js';
        config.output.filename = isEnvProduction
            ? 'static/js/[name].[contenthash:8].js'
            : isEnvDevelopment && 'static/js/[name].bundle.js';
        // // plugins
        const plugins = config.plugins;
        plugins.splice(0, 1, new HtmlWebpackPlugin(
            Object.assign(
              {},
              {
                inject: true,
                chunks: ['index'],
                template: paths.appHtml,
                filename: 'index.html',
              },
              isEnvProduction
                ? {
                    minify: {
                      removeComments: true,
                      collapseWhitespace: true,
                      removeRedundantAttributes: true,
                      useShortDoctype: true,
                      removeEmptyAttributes: true,
                      removeStyleLinkTypeAttributes: true,
                      keepClosingSlash: true,
                      minifyJS: true,
                      minifyCSS: true,
                      minifyURLs: true,
                    },
                  }
                : undefined
            )),
            new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                  inject: true,
                  chunks: ['admin'],
                  template: paths.appAdminHtml,
                  filename: 'admin.html',
                },
                isEnvProduction
                  ? {
                      minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                      },
                    }
                  : undefined
              )            
        ));

        plugins.splice(8, 1, new ManifestPlugin(
            {
            fileName: 'asset-manifest.json',
            publicPath: paths.publicUrlOrPath,
            generate: (seed, files, entrypoints) => {
              const manifestFiles = files.reduce((manifest, file) => {
                manifest[file.name] = file.path;
                return manifest;
              }, seed);
              // const entrypointFiles = entrypoints.main.filter(
              //   fileName => !fileName.endsWith('.map')
              // );
              // let entrypointFiles = [];
              // for (let [entryFile, fileName] of Object.entries(entrypoints)) {
              //   let notMapFiles = fileName.filter(fileName => !fileName.endsWith('.map'));
              //   entrypointFiles = entrypointFiles.concat(notMapFiles);
              // };
              const entrypointFiles = {};
              Object.keys(entrypoints).forEach(entrypoint => {
                entrypointFiles[entrypoint] = entrypoints[entrypoint].filter(fileName => !fileName.endsWith('.map'));
              });
    
              return {
                files: manifestFiles,
                entrypoints: entrypointFiles,
              };
            }
        }));

        return config;
    },
    // WEBPACKDEVSERVER CONFIGURATION OVERRIDES
    devServer: function(configFunction) {
        return function(proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);
            config.historyApiFallback = {
                disableDotRule: true,
                verbose: true,
                rewrites: [
                    { from: /^\/admin/, to: '/admin.html' },
                ]                
            };
            return config;
        }
    },
    paths: function(paths, env) {
        // admin page
        paths.appAdminHtml = resolveApp('public/admin.html');
        paths.appAdminIndexTsx = resolveModule(resolveApp, 'src/admin/index');
        return paths;
    }
};